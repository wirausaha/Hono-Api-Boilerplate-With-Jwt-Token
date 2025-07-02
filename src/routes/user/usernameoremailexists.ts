import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'
import {UsernameOrEmailExists} from '../../services/userservices'

const route = new Hono()

route.post('/user/usernameoremailexists', verifyAccessToken, async (c) => {
    const body: {
        username: string,
        email: string
    } = await c.req.json()
    const { username, email } = body
    
    const useroremailexist = UsernameOrEmailExists(username, email);
    if (! useroremailexist) {
        console.error('Error /user/userexist:')
        return c.json({ success: false, error: 'Internal server error : userexist()' }, 500)        
    } else {
        return c.json({ success: true, exists : useroremailexist }, 200)
    }
    
})

export default route