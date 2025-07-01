# 🚀 Hono API Template (Docker + PostgreSQL + Redis + Prisma)

Project ini adalah starter kit backend menggunakan [Hono](https://hono.dev/) dengan integrasi ke PostgreSQL (via Prisma ORM) dan Redis (via ioredis), siap dijalankan dalam Docker Compose untuk pengembangan yang konsisten dan scalable.

---

## 🧰 Stack Teknologi

- [Hono](https://hono.dev/) — Web framework ringan berbasis Web Standards
- [Docker Compose](https://docs.docker.com/compose/) — Orkestrasi service Redis, PostgreSQL, dan API
- [PostgreSQL](https://www.postgresql.org/) — Database relasional tangguh
- [Redis](https://redis.io/) — In-memory cache untuk performa tinggi
- [Prisma ORM](https://www.prisma.io/) — ORM modern & type-safe untuk PostgreSQL

---

## ⚙️ Setup & Jalankan

### 1. Clone & install dependencies
```bash
git clone <repo-url>
cd Hono-API-Template
npm install

2. Buat file .env
PORT=3000
JWT_SECRET=supersecretvalue123

# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpass
POSTGRES_DB=mydb
DATABASE_USER=admin
DATABASE_PASSWORD=adminpass
DATABASE_NAME=mydb
DATABASE_PORT=5432
DATABASE_URL=postgresql://admin:adminpass@database:5432/mydb

# Redis
CACHE_USERNAME=default
CACHE_PASSWORD=redispass123
CACHE_PORT=6379
CACHE_URL=redis://default:redispass123@cache:6379

3. Jalankan Docker
docker-compose up -d


Pastikan volume cache_data dan pg_data sudah dideklarasikan di docker-compose.yml


🧪 Testing API
🔹 Ping Database
GET /api/koneksi-database-berhasil
→ Menggunakan Prisma untuk jalankan SELECT 1
🔹 Ping Redis
GET /api/ping-cache
→ Set + Get value untuk test koneksi Redis


🐛 Troubleshooting
| Masalah | Solusi | 
| volume "cache_data" is undefined | Tambahkan volumes: di bagian bawah docker-compose.yml | 
| services.cache_data must be a mapping | Pastikan volumes: tidak berada dalam blok services: | 
| redis-cli gagal, container restart terus | Revisi perintah command: Redis agar tidak error parsing password | 
| ioredis: ENOTFOUND cache saat npm run dev | Ganti host cache jadi localhost jika tidak menjalankan dari dalam container | 
| prisma db pull gagal karena DATABASE_URL kosong | Isi .env dengan DATABASE_URL=... | 



🔄 Prisma Command
- Sync DB dengan schema:
npx prisma db pull
npx prisma generate
- Menambahkan model baru:
npx prisma migrate dev --name <deskriptif>



📦 Struktur Direktori
src/
├── index.ts              # Entry point utama
├── routes/
│   └── sample/           # Modular route (ping-cache, user, dsb)
prisma/
├── schema.prisma         # Definisi model database
.env                      # Konfigurasi environment
docker-compose.yml        # Definisi service Docker



💡 Tips Pengembangan
- Semua endpoint bisa diprefix dengan /api
- Gunakan Prisma Studio untuk visualisasi database:

- Gunakan Prisma Studio untuk visualisasi database:
npx prisma studio



🔐 Auth Token (JWT)
Pastikan .env berisi JWT_SECRET yang unik. Kamu bisa mengembangkan middleware JWT auth dengan hono/jwt.

✨ Siap Lanjut?
- [ ] Tambah POST /user untuk input data ke DB
- [ ] Integrasi Redis sebagai cache token/session
- [ ] Coba fetch dari WebView, Android, atau frontend

---


