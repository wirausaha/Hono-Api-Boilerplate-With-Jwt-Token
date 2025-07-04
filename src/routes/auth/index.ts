import { Hono } from 'hono'

import registerRoute from './register'
import loginRoute from './login'
import refreshtokenRoute from './handlerefreshtoken'
import testToken from './testtoken'

import { handleLogout } from './logout'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { handleLogoutAllSessions } from './logoutallsession'

const authRoutes = new Hono()

authRoutes.route('/', registerRoute)
authRoutes.route('/', loginRoute)
authRoutes.route('/', refreshtokenRoute)
authRoutes.route('/', testToken)
authRoutes.post('/logout', handleLogout)
authRoutes.post('/logout-all-session', verifyAccessToken, handleLogoutAllSessions)

export default authRoutes