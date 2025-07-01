import { Context, Hono } from 'hono';

export function getClientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for')
  const ipFromHeader = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()

  const ipFromSocket = (c.req.raw as any)?.socket?.remoteAddress // hanya Node.js

  return ipFromHeader || ipFromSocket || 'unknown'
}