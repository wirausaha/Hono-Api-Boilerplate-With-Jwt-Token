# Hono API Backend - Custom Edition

A backend template built using [Hono](https://hono.dev/), Prisma, Redis, and PostgreSQL — customized from the original [hono-api-template](https://github.com/Aditya-Jyoti/Hono-API-Template) by @Aditya-Jyoti & @AltSumpreme.

## Customizations & Improvements

- Modular service layer using `userDtos` projection
- JWT-based authentication with contextual validation
- Export endpoints for CSV/Excel with dynamic filename
- Prisma client instantiation optimized for dev/production
- Route-level role checks for admin/superuser access
- Redis integration for caching and token rotation
- Database : Users table & tbsystoken table
- Routes Added (5/7/25)
    - Auth : Register, Login, Logout, LogoutAllSession, RefreshToken
    - User : Count, MyProfile, UserProfile, ExportToCsv, ExportToXlsx, AddUser, DeleteUser, UpdateUser, 
             GetUserWithPagination, MyRole, UserRole UserExist, UserNameOrEmailExist 

## 📦 Tech Stack

- Hono framework
- Prisma ORM + PostgreSQL
- Redis (via ioredis docker)
- CSV & Excel export utilities
- React Native (planned)


## 🚀 Usage

```bash
npm install
npm run dev


