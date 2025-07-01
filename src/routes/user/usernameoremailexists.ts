import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'

const route = new Hono()

route.post('/user/usernameoremailexists', verifyAccessToken, async (c) => {
    const body: {
        username: string,
        email: string
    } = await c.req.json()
    const { username, email } = body
    
    try {
        const userCount = await prisma.users.count({
            where: { OR: [{ UserName: username }, { Email: email }] }        
        })
        return c.json({ success: true, exists : userCount }, 200)
    } catch (err) {
        console.error('Error /user/userexist:', err)
        return c.json({ success: false, error: 'Internal server error : userexist()' }, 500)
    }
    
})

export default route