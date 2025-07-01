import * as XLSX from 'xlsx'

export function exportToExcel(
  data: Record<string, any>[],
  fieldMap?: Record<string, string>,
  sheetName = 'Sheet1'
): Buffer {
  let rows = data

  if (fieldMap) {
    rows = data.map((item) => {
      const mapped: Record<string, any> = {}
      for (const key in fieldMap) {
        if (key in item) {
          mapped[fieldMap[key]] = item[key]
        }
      }
      return mapped
    })
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
}