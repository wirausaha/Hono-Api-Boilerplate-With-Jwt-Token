import { Hono } from 'hono'

import registerRoute from './register'
import loginRoute from './login'
import refreshtokenRoute from './handlerefreshtoken'
import { handleLogout } from './logout'
import { verifyAccessToken } from '../../middleware/middlewareverifytoken'
import { handleLogoutAllSessions } from './logoutallsession'

const authRoutes = new Hono()

authRoutes.route('/api', registerRoute)
authRoutes.route('/api', loginRoute)
authRoutes.route('/api', refreshtokenRoute)
authRoutes.post('/api/logout', handleLogout)
authRoutes.post('/api/logout-all-session', verifyAccessToken, handleLogoutAllSessions)

export default authRoutes