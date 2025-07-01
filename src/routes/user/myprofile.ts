import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getUserProfile } from '../../services/userservices';
import {keysToLowercase} from '../../helper/smallkey'

export const myProfile = new Hono();
export const userProfile = new Hono();

myProfile.get('/user/myprofile', verifyAccessToken, async (c) => {
  const payload = c.get('jwtPayload')
  const user = await getUserProfile(payload.userId)

  return user
    ? c.json({ success: true, user: keysToLowercase(user) })
    : c.json({ success: false, message: "Data pemakai tidak ditemukan" }, 404)
})

// Get someone profile
userProfile.post('/user/userprofile', verifyAccessToken, async (c) => {
  const body: { username: string } = await c.req.json()
  const { username } = body
  const payload = c.get('jwtPayload')
  const myid = await getUserProfile(payload.userId)

  if (!myid) {
    return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
  }

  if (myid.UserRole === "Superuser" || myid.UserRole === "Administrator") {
    const user = await getUserProfile(username)
    return user
      ? c.json({ success: true, user: keysToLowercase(user) })
      : c.json({ success: false, message: "Data pemakai tidak ditemukan" }, 404)
  }
  return c.json({ success: false, message: "Anda tidak berhak" }, 401)
})

export default { myProfile, userProfile }


