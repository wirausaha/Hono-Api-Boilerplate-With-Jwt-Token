import { Context } from 'hono'

export function getLang(c: Context): 'id' | 'en' {
  const fromHeader = c.req.header('lang') || c.req.header('accept-language') || ''  
  if (fromHeader.toLowerCase().startsWith('id')) return 'id'
  return 'en'
}