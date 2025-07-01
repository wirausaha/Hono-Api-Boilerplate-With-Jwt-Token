export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const result: string[] = []

  const randomLength = Math.max(0, length - 10)
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result.push(chars[randomIndex])
  }
  const ticks = Date.now().toString().padEnd(13, '0').substring(0, 10)
  result.push(...ticks)

  return result.join('')
}