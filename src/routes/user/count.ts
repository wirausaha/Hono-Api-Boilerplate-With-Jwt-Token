import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'

const route = new Hono()

route.get('/user/count', verifyAccessToken, async (c) => {

  try {
    const countUser = await prisma.users.count()
    return c.json({ success: true, count: countUser }, 200)
  } catch (err) {
    console.error('Error counting users:', err)
    return c.json({ success: false, error: 'Internal server error : /user/count()' }, 500)
  }

})

export default route