import { Hono } from 'hono'
import bcrypt from 'bcrypt'
import { generateRandomString } from '../../utils/randomstring'
import prisma from '../../lib/prisma-client'

const route = new Hono();

route.post('/register', async (c) => {
    const body: {
        username: string
        email: string
        password: string
        role: string
        termsagrement: number
        } = await c.req.json()

    const { username, email, password, role, termsagrement } = body

    // Validasi email dan username 
    const existing = await prisma.users.findFirst({
    where: {
        OR: [
        { Email: email },
        { UserName: username }
        ]
    }
    })    

    //  const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return c.json({ error: 'Username atau Email sudah terdaftar' }, 400)

    if (!username || !email || !password || !role) {
    return c.json({ error: 'Semua field wajib diisi' }, 400)
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValidEmail) {
        return c.json({ error: 'Format email tidak valid' }, 400)
    }

    if (password.length < 6) {
    return c.json({ error: 'Password minimal 6 karakter' }, 400)
    }        

    // Hash password
    const hashed = await bcrypt.hash(password, 10)
    const id = generateRandomString(36)
    //const id = randomUUID();

    try {
        const users = await prisma.users.create({
            data: { UserId: id, UserName: username, Email: email, Password: hashed, UserRole: role, TermsAgrement: termsagrement },
        })
        const oReturn =  { id: users.UserId, username: users.UserName, email: users.Email  }        
        return c.json({ message: 'Registrasi berhasil', user: oReturn })
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Gagal mendaftar, silakan coba lagi' }, 500)
    }

  // Simpan user bar

})

export default route