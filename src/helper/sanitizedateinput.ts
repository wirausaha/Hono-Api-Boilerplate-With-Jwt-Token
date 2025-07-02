export function sanitizeDateInput(input: unknown): Date {
  const raw = typeof input === 'string' ? input.trim() : ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return new Date(`${raw}T00:00:00.000Z`)
  }

  // fallback ke hari ini
  return new Date()
}