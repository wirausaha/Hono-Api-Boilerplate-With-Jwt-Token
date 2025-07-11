import { userDtos } from '../select/userdtos';
import prisma from '../lib/prisma-client'
import { Prisma } from '@prisma/client';

export async function getUserProfile(identifier: string) {
    try {
        return prisma.users.findFirst({
            where: { OR: [{ UserId: identifier }, { UserName: identifier }] },
            select: userDtos
        })
    }  catch (err) {
        return null;
    }
}

export async function getUserWithPagination(params: {
  draw: number
  start: number
  length: number
  filter?: string
  lastUpdate?: Date // optional param, tapi tidak digunakan di logika C# tadi
}) {
  const { draw, start, length, filter } = params

  const whereClause = filter
    ? {
        UserName: {
          contains: filter,
          mode: Prisma.QueryMode.insensitive
        }
      }
    : {}

  const [users, recordsTotal, recordsFiltered] = await Promise.all([
    prisma.users.findMany({
      where: whereClause,
      orderBy: { UserName: 'asc' },
      skip: start,
      take: length,
      select: userDtos
    }),
    prisma.users.count(), // total tanpa filter
    prisma.users.count({ where: whereClause }) // total setelah filter
  ])

  return {
    draw: draw,
    recordsTotal: recordsTotal,
    recordsFiltered: recordsFiltered,
    data: users
  }
}

export async function getUserRole(userid: string) {
    try {
        return prisma.users.findFirst({            
            where: { UserId: userid },
            select: { UserRole: true }
        })
    }  catch (err) {
        return null;
    }
}

export async function UsernameOrEmailExists(username: string, email: string) {
    try {
        return await prisma.users.count({
            where: { OR: [{ UserName: username }, { Email: email }] }        
        })
    } catch (err) {
        return null;
    }  
}

export async function UserNotExists(username: string, email: string) {
    try {
        const userExist = await prisma.users.count({
              where: { OR: [{ UserName: username }, { Email: email }] }        
        })
        return userExist <= 0
    } catch (err) {
        return null;
    }  
}