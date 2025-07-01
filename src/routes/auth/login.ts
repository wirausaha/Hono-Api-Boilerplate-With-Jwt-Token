import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import UAParser from 'ua-parser-js'
import { getConnInfo } from 'hono/cloudflare-workers' // atau 'hono/node-server' tergantung environment
import { getClientIp } from '../../helper/getclientip';
import prisma from '../../lib/prisma-client'

const route = new Hono();

route.post('/login', async (c) => {
    const body: {
        emailOrUsername: string
        password: string
        rememberme: number
        deviceid?: string
    } = await c.req.json()

    const { emailOrUsername, password, rememberme, deviceid } = body

    // Cari user berdasarkan email atau username
    console.log("Username : ", emailOrUsername, " Password : ", password, " Device : ", deviceid )

    const user = await prisma.users.findFirst({
        where: {
        OR: [
            { Email: emailOrUsername },
            { UserName: emailOrUsername }
        ]
        }
    })
    
    if (! user) {
        console.log("Password/User salah" )
        return c.json({ success: false, error: 'Password atau Email/Username salah' }, 404)
    }

    // Cek password
    const isValid = await bcrypt.compare(password, user.Password)

    if (!isValid) {
        console.log("Password/User slah 2" )
        return c.json({ success: false, error: 'Password atau Email/Username salah' }, 401)
    }

    // Buat JWT token
    const secret = process.env.JWT_SECRET || 'fa3b9bc620714a2aa2fa47709850f7e9'
    const token = jwt.sign(
        { userId: user.UserId, email: user.Email, role: user.UserRole }, // payload
        secret,
        { expiresIn: '30m' }
    )

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() + ((rememberme) ? 7 : 1) * 24 * 60 * 60 * 1000)

    const userAgent = c.req.header('User-Agent') || ''    

    const conn = getConnInfo(c)
    const ipAddress = getClientIp(c);

    try {
        const users = await prisma.tbsystoken.create({
            data: { userid: user.UserId, refreshtoken: refreshToken, 
                accesstoken: token, expiredate: refreshTokenExpiry,
                companycode: '000', userrole: user.UserRole, 
                isexpired: 0, ipaddress: ipAddress, email: user.Email,
                useragent: userAgent, deviceid: deviceid ?? "not sent"},
        })
    } catch (err) {
        console.error('Terjadi kesalahan saat insert token:', err)
        return c.json({ success: false, error: 'System gagal membuat token, silahkan coba lagi' }, 400)
    }
      console.log("Login sukses" )

    // Login berhasil
    return c.json({ success: true, message: 'Login berhasil',
        user: { id: user.UserId, username: user.UserName, email: user.Email, role: user.UserRole}, token: token, refreshtoken: refreshToken}, 200)
})

export default route