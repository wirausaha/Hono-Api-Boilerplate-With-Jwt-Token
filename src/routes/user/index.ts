import { Hono } from 'hono'

// Import semua route file dari folder user
import userCount from './count'
import usernameExist from './userexist'
import emailExist from './emailexist'
import getAvatar from './useravatar'
import myRole from './myrole'
import userNameOrEmailExists from './usernameoremailexists'
import { myProfile, userProfile } from './myprofile'
import exportToCsv from './exporttocsv'
import exportToXls from './exporttoxlsx'

const userRoutes = new Hono()

// Gabungkan semua sub-route ke userRoutes
userRoutes.route('/', userCount)
userRoutes.route('/', usernameExist)
userRoutes.route('/', emailExist)
userRoutes.route('/', getAvatar)
userRoutes.route('/', myRole)
userRoutes.route('/', userNameOrEmailExists)
userRoutes.route('/', myProfile)
userRoutes.route('/', userProfile)
userRoutes.route('/', exportToCsv)
userRoutes.route('/', exportToXls)

export default userRoutes