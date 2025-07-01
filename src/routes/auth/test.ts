import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  const newUser = await prisma.user.create({
    data: {
      username: 'Bisfren',
      email: 'tes@email.com',
      password: 'hashedpassword',
    }
  })

  console.log(newUser)
}

test()