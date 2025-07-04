import { camelCaseKey } from '../../helper/camelcase';
import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getUserProfile } from '../../services/userservices';
import { keysToLowercase} from '../../helper/smallkey'
import { getOrCache } from '../../utils/redisutil'


export const myProfile = new Hono();
export const userProfile = new Hono();

myProfile.get('/user/getmyprofile', verifyAccessToken, async (c) => {
  const payload = c.get('jwtPayload')
  const userId = payload.userId ?? "";

  // Test pakai redis
  const cacheKey = `profile:${userId}`
  const user = await getOrCache(cacheKey, 300, () => getUserProfile(userId))
//  const user = await getUserProfile(userId)

    if (! user) {
        return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
    }
    const url = new URL(c.req.url)
    const baseUrl = url.origin
    const camel = camelCaseKey(user)
    // Harus ngakal2in karena ternyata hasilnya jadi ada 2 property avatar200x200 
    delete camel.avatar200x200
    camel.avatar200x200 = `${baseUrl}${user.Avatar200x200?.trim?.() || ''}`
    return c.json({ success: true, user: camel })
})

// Get someone profile
userProfile.post('/user/userprofile', verifyAccessToken, async (c) => {
  const body: { username: string } = await c.req.json()
  const { username } = body
  const payload = c.get('jwtPayload')
  const myUserId = payload.userId;

    // coba pakai redis
    const myid = await getOrCache(`profile:${myUserId}`, 300, () => getUserProfile(myUserId))

    //const myid = await getUserProfile(myUserId)

    if (! myid) {
      return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
    }

    if (myid.UserRole === "Superuser" || myid.UserRole === "Administrator") {
      // coba pakai redis
      const user = await getOrCache(`profile:${username}`, 300, () => getUserProfile(username))
      //const user = await getUserProfile(username)

      if (! user) {
        return c.json({ success: false, message: "Data pengguna tidak ditemukan" }, 404)
      }
      const url = new URL(c.req.url)
      const baseUrl = url.origin
      const camel = camelCaseKey(user)
      delete camel.avatar200x200
      camel.avatar200x200 = `${baseUrl}${user.Avatar200x200?.trim?.() || ''}`
      return c.json({ success: true, user: camel })

    }
    return c.json({ success: false, message: "Anda tidak berhak" }, 401)
})

export default { myProfile, userProfile }


