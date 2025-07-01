const isValidDateFormat = (date: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date)

export function sanitizeDateInput(input: unknown): string {
  const raw = typeof input === 'string' ? input.trim() : ''
  if (isValidDateFormat(raw)) {
    return raw
  }

  // kalau invalid, kembalikan tanggal hari ini 
  return new Date().toISOString().split('T')[0]
}