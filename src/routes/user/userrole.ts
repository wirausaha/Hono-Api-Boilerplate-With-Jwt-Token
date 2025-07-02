import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'

const userRole = new Hono()

userRole.get('/user/userrole', verifyAccessToken, async (c) => {

    const aRole: Array<string> = ["Superuser", "Administrator", "Operator", "Kasir", "Lainnya"]
    return c.json({ success: true, role: aRole}, 200)

})

export default userRole