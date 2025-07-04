import { camelCaseKey } from '../../helper/camelcase';
import { invalidateCache } from '../../utils/redisutil'
import { changePasswordDto, userDtos, userInputDto } from './../../select/userdtos';
import { Hono } from 'hono'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { getLang } from '../../utils/lang'
import prisma from '../../lib/prisma-client'
import bcrypt from 'bcrypt'



import { randomInt } from 'crypto';

const userEditRoute = new Hono()

userEditRoute.post('/user/changepassword', verifyAccessToken, async (c) => {

    const lang = getLang(c) // ambil bahasa dari JWT / header / query

    const body = await c.req.parseBody()
    const avatarFile = body.avatarFile as File | undefined

    const userData : changePasswordDto = {
        userName: (body.userName as string)?.slice(0, 32),
        oldPassword: (body.email as string)?.slice(0, 50),
        newPassword: (body.password as string)?.slice(0, 32)
    }

    console.log(userData.userName)
    const user = await prisma.users.findUnique({ where : {UserName: userData.userName} })
    if (! user) {
        const message = lang === 'id'
        ? 'Data tidak terdaftar'
        : 'Data does not exist'
        return c.json({ success: false, message }, 400)
    }

    try {
        await prisma.users.update({
            where: { UserName: userData.userName },
            data: {
                Password: await bcrypt.hash(userData.newPassword, 10),
            },
        })
        const user = await prisma.users.findUnique({ where : {UserName: userData.userName} })
        const message = lang === 'id'
            ? 'Data sudah disimpan'
            : 'User saved successfully'
        const url = new URL(c.req.url)
        const baseUrl = url.origin
        if (user) {
            await invalidateCache(`profile:${user.UserId}`)
            return c.json({ success: true, message: message, user: true })
        }        
    } catch (err) {
        console.error(err)
    }
    return c.json({ success: false, error: lang === 'id'
        ? 'Data gagal disimpan'
        : 'Saving data failed' }, 500)

}) 
export default userEditRoute