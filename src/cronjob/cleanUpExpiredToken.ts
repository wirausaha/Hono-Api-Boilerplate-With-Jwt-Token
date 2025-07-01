import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupExpiredTokens() {
  const now = new Date()

  const deleted = await prisma.tbsystoken.deleteMany({
    where: {
      OR: [
        { expiredate: { lt: now } },
        { isexpired: 1 }
      ]
    }
  })

  console.log(`${deleted.count} token kadaluarsa dibersihkan`)
}

cleanupExpiredTokens()
  .catch((e) => console.error(e))
  .finally(() => process.exit())