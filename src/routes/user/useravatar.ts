import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import prisma from '../../lib/prisma-client'

const route = new Hono()

route.get('/user/getavatar', verifyAccessToken, async (c) => {
  const payload = c.get('jwtPayload')
  const userId = payload.userId

  try {
    const user = await prisma.users.findUnique({
        where: { UserId: userId },
        select: { Avatar200x200: true }
    })

    if (!user || !user.Avatar200x200) {
        return c.json({ error: 'Avatar not found' }, 404)
    }
    const url = new URL(c.req.url)
    const fullAvatarUrl = `${url.origin}${user.Avatar200x200}`
    return c.json({
      success: true,
      avatar: fullAvatarUrl,
    })
  } catch (err) {
    console.error('Error /user/useravatar:', err)
    return c.json({ success: false, error: 'Internal server error : getavatar()' }, 500)
  }
})

export default route