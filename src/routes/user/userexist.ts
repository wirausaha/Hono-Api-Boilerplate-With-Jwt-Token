import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'

const route = new Hono()

route.post('/user/userexists', verifyAccessToken, async (c) => {
    const body: {
        username: string,
    } = await c.req.json()
    const { username } = body
    
    try {
        const userCount = await prisma.users.count({
            where: { UserName: username }        
        })
        return c.json({ success: true, userexist: userCount }, 200)
    } catch (err) {
        console.error('Error /user/userexist:', err)
        return c.json({ success: false, error: 'Internal server error : userexist()' }, 500)
    }
    
})

export default route