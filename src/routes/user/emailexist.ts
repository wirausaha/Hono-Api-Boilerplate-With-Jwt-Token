import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'

const route = new Hono()

route.post('/user/emailexists', verifyAccessToken, async (c) => {
    const body: {
        email: string,
    } = await c.req.json()
    const { email } = body
    
    try {
        const userCount = await prisma.users.count({
            where: { Email: email }        
        })
        return c.json({ success: true, emailexist: userCount }, 200)
    } catch (err) {
        console.error('Error /user/emailexist:', err)
        return c.json({ success: false, error: 'Internal server error : userexist()' }, 500)
    }
    
})

export default route