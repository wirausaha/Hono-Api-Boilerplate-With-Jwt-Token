import { Context, Hono } from 'hono';
import { verify } from 'hono/jwt'
import bcrypt from 'bcrypt';
import UAParser from 'ua-parser-js'
import { getConnInfo } from 'hono/cloudflare-workers' // atau 'hono/node-server' tergantung environment
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { getClientIp } from '../../helper/getclientip';

import prisma from '../../lib/prisma-client'
const route = new Hono();


route.post('/refreshtoken', async (c) => {
    const body: {
        accesstoken: string
        refreshtoken: string
        rememberme: number
        deviceid?: string
    } = await c.req.json()    
  const { accesstoken, refreshtoken, rememberme, deviceid } = body

  const userAgent = c.req.header('User-Agent') || ''
  const ipAddress = getClientIp(c);

  if (typeof accesstoken !== 'string' || !accesstoken.trim()) {
    return c.json({ success: false, error: 'Access token tidak valid atau kosong' }, 400)
  }


  try {
    await verify(accesstoken, process.env.JWT_SECRET!)
    return c.json({ success: true, token: accesstoken, refreshtoken: refreshtoken })
  } catch (err) 
  {
    if (err instanceof Error) {
      if (err.name === 'JwtTokenExpired') {
        console.log('Token expired, lanjut ke refresh flow')
        // lanjutkan proses refresh
      } else {
        console.error('JWT verify error:', err)
        return c.json({ success: false, error: 'Access token tidak valid' }, 401)
      }
    } else {
      console.error('Unknown error:', err)
      return c.json({ success: false, error: 'Terjadi kesalahan tak terduga' }, 500)
    }
  }    

  // Cari data token lama di DB
  console.log("IP Address ", ipAddress, " User Agent : ", userAgent)
  const token = await prisma.tbsystoken.findFirst({
    where: {
      refreshtoken,
      accesstoken,
      deviceid,
      ipaddress: ipAddress,
      useragent: userAgent,
      isexpired: 0
    }
  })

  if (!token) {
    return c.json({ success: false, error: 'Token tidak valid atau tidak cocok dengan device ini' }, 401)
  }

  // 3️⃣ Cek apakah refresh token masih berlaku
  const now = new Date()
  if (!token.expiredate || token.expiredate < now) {
    return c.json({ success: false, error: 'Refresh token sudah kadaluarsa, silakan login ulang' }, 403)
  }

  // 4️⃣ Tandai token lama sudah kadaluarsa
  await prisma.tbsystoken.updateMany({
    where: { id: token.id },
    data: { isexpired: 1 }
  })

  // 5️⃣ Buat token baru
  const newAccessToken = jwt.sign(
    { userId: token.id, email: token.email, role: token.userrole }, 
    process.env.JWT_SECRET!,
    { expiresIn: '30m' }
  )

  const newRefreshToken = crypto.randomBytes(64).toString('hex')
  const newExpireDate = new Date(Date.now() + ((rememberme) ? 7 : 1) * 24 * 60 * 60 * 1000)

  await prisma.tbsystoken.create({
    data: {
      userid: token.userid,
      userrole: token.userrole,
      accesstoken: newAccessToken,
      refreshtoken: newRefreshToken,
      expiredate: newExpireDate,
      ipaddress: ipAddress,
      useragent: userAgent,
      deviceid,
      companycode: token.companycode,
      email: token.email
    }
  })
  console.log("token: ", newAccessToken)
  console.log("refresh token: ", newRefreshToken)

  return c.json({ success: true, token: newAccessToken, refreshtoken: newRefreshToken })
}) 
export default route