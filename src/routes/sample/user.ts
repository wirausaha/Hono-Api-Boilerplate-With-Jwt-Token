import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const userRoute = new Hono()

userRoute.post('/user', async (c) => {
  const body = await c.req.json()
  const { name, email } = body

  const user = await prisma.user.create({
    data: { name, email },
  })

  return c.json(user)
})

export default userRoute