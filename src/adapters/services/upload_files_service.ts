import { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export class UploadFilesService {
  public static async uploadIcon(
    file: MultipartFile,
    folder: string = 'uploads/icons',
    allowedExtnames: string[] = ['svg'],
    maxSize: string = '2mb'
  ): Promise<string> {
    if (!file) {
      throw new Error('NotFound: No icon provided')
    }

    if (!allowedExtnames.includes(file.extname || '')) {
      throw new Error(
        `InvalidExtension: Only the following extensions are allowed: ${allowedExtnames}`
      )
    }

    if (file.size && file.size > this.convertToBytes(maxSize)) {
      throw new Error(`InvalidSize: icon exceeds the maximum size of ${maxSize}`)
    }

    const fileName = `${cuid()}.${file.extname}`
    const filePath = app.makePath(folder)
    await file.move(filePath, { name: fileName })
    return `${folder}/${fileName}`
  }

  private static convertToBytes(size: string): number {
    const sizeMap: { [key: string]: number } = {
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024,
    }

    const unit = size.replace(/[0-9]/g, '').toLowerCase()
    const value = Number.parseFloat(size.replace(/[a-zA-Z]/g, ''))

    if (!sizeMap[unit]) {
      throw new Error(`InvalidSizeFormat: Unable to parse size ${size}`)
    }

    return value * sizeMap[unit]
  }
}
