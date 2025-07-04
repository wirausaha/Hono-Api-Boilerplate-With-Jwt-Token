import { Context } from 'hono'
import prisma from '../../lib/prisma-client'
import { getClientIp } from '../../helper/getclientip';

export const handleLogout = async (c: Context) => {
    const body: { accesstoken: string, refreshtoken: string, deviceid?: string } = await c.req.json()   
    const { accesstoken, refreshtoken, deviceid } = body  
    
    const userAgent = c.req.header('User-Agent') || ''
    const ipAddress = getClientIp(c);

    // Hapus atau tandai token ini sebagai expired
    const result = await prisma.tbsystoken.updateMany({
        where: {
        accesstoken,
        refreshtoken,
        deviceid,
        useragent: userAgent,
        ipaddress: ipAddress,
        isexpired: 0
        },
        data: {
        isexpired: 1
        }
    })

    if (result.count > 0) {
        return c.json({ success: true, message: 'Berhasil logout dan token dinonaktifkan' })
    } else {
        return c.json({ success: false, message: 'Token tidak ditemukan atau sudah tidak aktif' }, 404)
    }
}