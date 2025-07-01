import { Hono } from 'hono'
import Redis from 'ioredis'

const redis = new Redis(process.env.CACHE_URL!)
const cacheRoute = new Hono()

cacheRoute.get('/ping-cache', async (c) => {
  try {
    await redis.set('status', 'ok', 'EX', 10)
    const status = await redis.get('status')
    return c.json({ redis: status })
  } catch (err) {
    return c.json({ error: 'Redis error', detail: String(err) }, 500)
  }
})

export default cacheRoute