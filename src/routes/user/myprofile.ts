import { Redis } from 'ioredis';
import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getUserProfile } from '../../services/userservices';
import { keysToLowercase} from '../../helper/smallkey'
import { getOrCache } from '../../utils/redisutil'


export const myProfile = new Hono();
export const userProfile = new Hono();

myProfile.get('/user/myprofile', verifyAccessToken, async (c) => {
  const payload = c.get('jwtPayload')
  const userId = payload.userId ?? "";

  // Test pakai redis
  const cacheKey = `profile:${userId}`
  const user = await getOrCache(cacheKey, 300, () => getUserProfile(userId))

  return user
    ? c.json({ success: true, user: keysToLowercase(user) })
    : c.json({ success: false, message: "Data pemakai tidak ditemukan" }, 404)
})

// Get someone profile
userProfile.post('/user/userprofile', verifyAccessToken, async (c) => {
  const body: { username: string } = await c.req.json()
  const { username } = body
  const payload = c.get('jwtPayload')
  const myUserId = payload.userId;

  // coba pakai redis
  const myid = await getOrCache(`profile:${myUserId}`, 300, () => getUserProfile(myUserId))

  if (! myid) {
    return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
  }

  if (myid.UserRole === "Superuser" || myid.UserRole === "Administrator") {
    // coba pakai redis
    const user = await getOrCache(`profile:${username}`, 300, () => getUserProfile(username))
    return user
      ? c.json({ success: true, user: keysToLowercase(user) })
      : c.json({ success: false, message: "Data pemakai tidak ditemukan" }, 404)
  }
  return c.json({ success: false, message: "Anda tidak berhak" }, 401)
})

export default { myProfile, userProfile }


