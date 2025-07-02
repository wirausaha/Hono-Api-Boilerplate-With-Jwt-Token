import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getUserRole } from '../../services/userservices';
import {keysToLowercase} from '../../helper/smallkey'

export const route = new Hono();

route.get('/user/getmyrole', verifyAccessToken, async (c) => {
  const payload = c.get('jwtPayload')
  const user = await getUserRole(payload.userId)

  return user
    ? c.json({ success: true, role: user.UserRole })
    : c.json({ success: false, message: "Data pemakai tidak ditemukan" }, 404)
})

export default route;