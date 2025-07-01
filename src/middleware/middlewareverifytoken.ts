import { MiddlewareHandler } from 'hono'
import { jwt, verify } from 'hono/jwt'

export const verifyAccessToken: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: token tidak ditemukan' }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return c.json({ error: 'Token tidak valid: format tidak sesuai JWT' }, 400)
  }

  const parts = token.split('.')
  if (parts.length !== 3 || parts.some(p => !p.trim())) {
    return c.json({ error: 'Token tidak valid: struktur JWT tidak lengkap' }, 400)
  }
  
  try {
    const payload = await verify(token, process.env.JWT_SECRET!)
    c.set('jwtPayload', payload)
    await next()
  } catch (err) {
    const errorName = (err as any)?.constructor?.name || (err as any)?.name

    if (errorName === 'JwtTokenExpired') {
      console.warn('Token expired, lanjut ke refresh flow')
      return c.json({ error: 'Access token expired' }, 401)
    }

    console.error('Token tidak valid:', err)
    return c.json({ error: 'Unauthorized: token tidak valid' }, 401)
  }  

  
}