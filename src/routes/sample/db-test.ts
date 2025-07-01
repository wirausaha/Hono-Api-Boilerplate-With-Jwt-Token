import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const dbTestRoute = new Hono()
const prisma = new PrismaClient()

dbTestRoute.get('/koneksi-database-berhasil', async (c) => {
  try {
    // Tes koneksi dengan query ringan
    await prisma.$queryRaw`SELECT 1`
    return c.json({ status: 'sukses', message: 'Koneksi database berhasil 🎉' })
  } catch (error) {
    return c.json({ status: 'gagal', message: 'Gagal koneksi ke database ❌', error: String(error) }, 500)
  }
})

export default dbTestRoute