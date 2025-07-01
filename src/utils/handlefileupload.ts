import path from 'path'
import fs from 'fs/promises'

interface UploadOptions {
  allowedExtensions: string[]
  maxSizeInKb: number
  folder: string // path folder penyimpanan (ex: /images/avatars)
}

export async function handleFileUpload(file: File, options: UploadOptions) {
  const { allowedExtensions, maxSizeInKb, folder } = options

  // Validasi ukuran
  if (file.size > maxSizeInKb * 1024) {
    return { success: false, message: `Ukuran file melebihi ${maxSizeInKb} KB` }
  }

  // Validasi extension
  const ext = path.extname(file.name).toLowerCase()
  if (!allowedExtensions.includes(ext)) {
    return { success: false, message: `Ekstensi yang didukung hanya: ${allowedExtensions.join(', ')}` }
  }

  // Validasi MIME
  const mime = file.type
  if (!mime.startsWith('image/')) {
    return { success: false, message: 'File harus berupa gambar' }
  }

  // Generate nama unik + path simpan
  const uniqueName = `${crypto.randomUUID()}${ext}`
  const savePath = path.join(folder, uniqueName)

  await fs.mkdir(folder, { recursive: true })
  const buffer = await file.arrayBuffer()
  await fs.writeFile(savePath, Buffer.from(buffer))

  return { success: true, path: savePath }
}