import { camelCaseKey } from '../../helper/camelcase';
import { userDtos, userInputDto } from './../../select/userdtos';
import { Hono } from 'hono'
import { z } from 'zod'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { handleFileUpload } from '../../utils/handlefileupload'
import { getLang } from '../../utils/lang'
import { UsernameOrEmailExists } from '../../services/userservices'
import { generateRandomString } from '../../utils/randomstring'
import { sanitizeDateInput } from '../../helper/sanitizedateinput'
import prisma from '../../lib/prisma-client'
import path from 'path'


import { randomInt } from 'crypto';

const userAddRoute = new Hono()

userAddRoute.post('/user/addnewuser', verifyAccessToken, async (c) => {

    const lang = getLang(c) // ambil bahasa dari JWT / header / query

    const body = await c.req.parseBody()
    const avatarFile = body.avatarFile as File | undefined

    const userData : userInputDto = {
        UserId: generateRandomString(36),
        UserName: (body.userName as string)?.slice(0, 32),
        Email: (body.email as string)?.slice(0, 50),
        Password: (body.password as string)?.slice(0, 32),
        FirstName: (body.firstName as string)?.slice(0, 32),
        LastName: (body.lastName as string)?.slice(0, 32),
        UserRole: (body.userRole as string)?.slice(0, 20),
        Address: (body.address as string)?.slice(0, 40),
        Address2: (body.address2 as string)?.slice(0, 40),
        Province: (body.province as string)?.slice(0, 20),
        City: (body.city as string)?.slice(0, 20),
        ZipCode: (body.zipCode as string)?.slice(0, 6),
        PhoneNumber: (body.phonenumber as string)?.slice(0, 20),
        Avatar200x200: '',
        DateOfBirth: body.dateOfBirth as string | "20250607",
        IsActive: parseInt(body.isActive as string) || 1,
        IsEmailConfirmed: 0,
        IsPhoneConfirmed: 0,
        AvatarFile: body.avatarFile as File
    }

    // Validasi email, username, password, dll
    const emailPattern = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{6,20}(?<![_.])$/
    const usernamePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // /^[a-zA-Z0-9]+$/

    if (
        !userData.UserName ||
        !userData.Email ||
        !userData.Password ||
        !emailPattern.test(userData.Email) ||
        !usernamePattern.test(userData.UserName) ||
        userData.UserName.length < 6 || userData.UserName.length > 20 ||
        userData.Password.length < 6 || userData.Password.length > 20 ||
        userData.Email.length < 11 || userData.Email.length > 100
    ) {
        const message = lang === 'id'
        ? 'Validasi data gagal. Periksa panjang dan format input.'
        : 'Validation failed. Please check input length and format.'
        return c.json({ success: false, message }, 400)
    }

    const alreadyExists = await UsernameOrEmailExists(userData.UserName, userData.Email)
    if (alreadyExists) {
        const message = lang === 'id'
        ? 'Username atau email sudah digunakan'
        : 'Username or email already exists'
        return c.json({ success: false, message }, 400)
    }

    // Proses avatar upload jika ada
    const fakeUpload = (process.env.FAKE_UPLOAD || "1") == "1"
    let avatarPath: string | null = null
    if (! fakeUpload) {
        if (userData.AvatarFile) {
            console.log("Avatar tidak null")
            const result = await handleFileUpload(userData.AvatarFile, {
                allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                maxSizeInKb: 30,
                folder: path.join(process.cwd(), 'public', 'images', 'avatars'),
            })
            console.log("Upload result : ", result)
            if (!result.success) {
            return c.json({ success: false, message: result.message }, 400)
            }

            avatarPath = result.path || ""
            const publicPath = avatarPath.replace(
            path.join(process.cwd(), 'public'), '').replace(/\\/g, '/') // Normalize backslashes for cross-platform compatibility
            avatarPath = publicPath
            
        }   
    } else {
        const dummyList = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']
        avatarPath = `/images/avatars/${dummyList[randomInt(0, dummyList.length - 1)]}`
    }   

    // Simpan user
    const newUser = {
        UserId: generateRandomString(36),
        UserName: userData.UserName,
        Email: userData.Email,
        Password: userData.Password,
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        UserRole: userData.UserRole,
        Address: userData.Address,
        Address2: userData.Address2,
        Province: userData.Province,
        City: userData.City,
        ZipCode: userData.ZipCode,
        DateOfBirth: sanitizeDateInput(userData.DateOfBirth),
        IsActive: userData.IsActive,
        Avatar200x200: avatarPath,
        TermsAgrement: 1
    }

    try {
        const users = await prisma.users.create({data: newUser})
        const message = lang === 'id'
            ? 'Data sudah disimpan'
            : 'User saved successfully'
        const url = new URL(c.req.url)
        const baseUrl = url.origin
        const camel = camelCaseKey(users)
        delete camel.avatar200x200
        camel.avatar200x200 = `${baseUrl}${newUser.Avatar200x200?.trim?.() || ''}`
        return c.json({ success: true, message: message, user: camel })
    } catch (err) {
        console.error(err)
        return c.json({ success: false, error: lang === 'id'
            ? 'Data gagal disimpan'
            : 'Saving data failed' }, 500)
    }
}) 
export default userAddRoute