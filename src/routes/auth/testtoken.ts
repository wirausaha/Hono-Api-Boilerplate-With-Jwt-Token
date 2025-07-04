import { Context, Hono } from 'hono';
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'

const route = new Hono();


route.post('/testtoken', verifyAccessToken, async (c) => {
    const body: {
        accesstoken: string
    } = await c.req.json()    
    const { accesstoken } = body

    const payload = c.get('jwtPayload')
    return c.json({ success: true, user: payload.userId })
})
export default route