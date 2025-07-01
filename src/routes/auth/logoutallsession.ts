import { Context } from 'hono'
import { getClientIp } from '../../helper/getclientip';
import prisma from '../../lib/prisma-client'

export const handleLogoutAllSessions = async (c: Context) => {
  const payload = c.get('jwtPayload')

  if (!payload?.userId) {
    return c.json({ error: 'User tidak valid' }, 401)
  }

  const result = await prisma.tbsystoken.updateMany({
    where: {
      userid: payload.userId,
      isexpired: 0
    },
    data: {
      isexpired: 1
    }
  })

  return c.json({
    success: true,
    message: `Berhasil keluar dari ${result.count} sesi perangkat`,
  })
}