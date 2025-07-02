import { camelCaseKey } from '../../helper/camelcase';
import { Redis } from 'ioredis';
import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getUserProfile } from '../../services/userservices';
import { getOrCache } from '../../utils/redisutil'
import { getUserWithPagination } from '../../services/userservices'


export const userWithPagination = new Hono();

userWithPagination.get('/user/getuserswithpagination', verifyAccessToken, async (c) => {
    const { draw, filter, start, length } = c.req.query()

    const payload = c.get('jwtPayload')
    const myUserId = payload.userId;

    // coba pakai redis
    const myid = await getOrCache(`profile:${myUserId}`, 300, () => getUserProfile(myUserId))

    if (! myid) {
      return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
    }

    if (myid.UserRole === "Superuser" || myid.UserRole === "Administrator") {

        const result = await getUserWithPagination({
            draw: Number(draw ?? 0),
            start: Number(start ?? 0),
            length: Number(length ?? 25),
            filter: filter ?? ''
        })
        const url = new URL(c.req.url)
        const baseUrl = url.origin
        let hasil: Record<string, any>[] = []
        result.data.forEach((user) => {
            const camel = camelCaseKey(user)
            // Harus ngakal2in karena ternyata hasilnya jadi ada 2 property avatar200x200 
            delete camel.avatar200x200
            camel.avatar200x200 = `${baseUrl}${user.Avatar200x200?.trim?.() || ''}`
            hasil.push(camel)
        })

/*      ini juga benar tapi tetap ada 2 property avatar200x200   
        const hasil2 = result.data.map((user) => {
        const camel = camelCaseKey(user)
        return {
            ...camel,
            avatar200x200: `${baseUrl}${camel.avatar200x200?.trim?.() || ''}`
        }
        }) */

        const finalResult = {
        ...result,
        data: hasil
        } 
        
        return c.json({ success: true, userlist: finalResult }, 200)
    }
    return c.json({ success: false, message: "Anda tidak berhak" }, 401)
})

export default { getUserWithPagination }