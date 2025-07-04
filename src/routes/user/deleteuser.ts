import { Redis } from 'ioredis';
import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getUserProfile } from '../../services/userservices';
import { keysToLowercase} from '../../helper/smallkey'
import { getOrCache } from '../../utils/redisutil'
import prisma from '../../lib/prisma-client'

export const deleteUser = new Hono();
export const disActivateUser = new Hono();


deleteUser.post('/user/deleteuser', verifyAccessToken, async (c) => {
  const body: { userName: string } = await c.req.json()
  const { userName } = body
  const payload = c.get('jwtPayload')
  const myUserId = payload.userId;

    // coba pakai redis
    const myid = await getOrCache(`profile:${myUserId}`, 300, () => getUserProfile(myUserId))

    if (! myid) {
      return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
    }

    if (myid.UserRole === "Superuser" || myid.UserRole === "Administrator") {

        const deleteuser = await prisma.users.findFirst({
            where: { UserName: userName },
        })

        if (! deleteuser) {
            console.log('User tidak ditemukan')
            return c.json({ success: false, error: "Data user tidak ditemukan"}, 404)
        } else {
            try {
                await prisma.users.delete({ where: { UserName: userName } })
                return c.json({ success: true, message: "User berhasil dihapus"}, 200)
            } catch (err) {
                console.log("Error delete user : ", err )
                return c.json({ success: false, error: "Sistem error"}, 500)
            }        
        }
    }
    return c.json({ success: false, message: "Anda tidak berhak" }, 401)
})

disActivateUser.post('/user/disactivateuser', verifyAccessToken, async (c) => {
  const body: { userName: string } = await c.req.json()
  const { userName } = body
  const payload = c.get('jwtPayload')
  const myUserId = payload.userId;

    // coba pakai redis
    const myid = await getOrCache(`profile:${myUserId}`, 300, () => getUserProfile(myUserId))

    //const myid = await getUserProfile(myUserId)

    if (! myid) {
      return c.json({ success: false, message: "Data anda tidak ditemukan" }, 404)
    }

    if (myid.UserRole === "Superuser" || myid.UserRole === "Administrator") {

        const updateuser = await prisma.users.findUnique({
            where: { UserName: userName },
        })

        if (! updateuser) {
            console.log('User tidak ditemukan')
            return c.json({ success: false, error: "Data user tidak ditemukan"}, 404)
        } else {
            try {
                await prisma.users.update({ where: { UserName: userName }, data: {IsActive: 0} })
                return c.json({ success: true, message: "User berhasil dinon-aktifkan"}, 200)
            } catch (err) {
                return c.json({ success: false, error: "Sistem error"}, 500)
            }        
        }
    }
    return c.json({ success: false, message: "Anda tidak berhak" }, 401)
})

export default {deleteUser, disActivateUser}


