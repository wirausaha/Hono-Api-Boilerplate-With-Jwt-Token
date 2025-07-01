import { Parser } from 'json2csv'

export function exportToCsv<T>(data: T[], fieldMap: Record<string, string>) {
  const fields = Object.entries(fieldMap).map(([value, label]) => ({ label, value }))
  const parser = new Parser({ fields })
  return parser.parse(data)
}

