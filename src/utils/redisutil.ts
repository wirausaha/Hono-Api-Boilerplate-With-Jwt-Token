import Redis from 'ioredis'

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'redispass123', // ganti dengan password Redis kamu
});

//redispass123
export async function getOrCache<T>(
  key: string,
  ttl: number,
  resolver: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    console.log('Redis hit:', key)
    return JSON.parse(cached)
  }

  const result = await resolver()
  await redis.set(key, JSON.stringify(result), 'EX', ttl)
  console.log('Redis miss:', key)
  return result
}