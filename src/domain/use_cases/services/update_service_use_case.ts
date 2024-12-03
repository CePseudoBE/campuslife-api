import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'
import { Service } from '#domain/entities/service'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

@inject()
export class UpdateServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  public async handle(
    id: number,
    data: {
      title_en: string | undefined
      title_fr: string | undefined
      description_en: string | undefined
      description_fr: string | undefined
      url: string | undefined
      icon: MultipartFile | undefined
      isActive: boolean | undefined
    }
  ): Promise<Service> {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      throw new Error(`NotFound: Service with id ${id} not found`)
    }

    if (data.url) {
      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
      if (!urlRegex.test(data.url)) {
        throw new Error('InvalidFormat: The provided URL is not valid.')
      }
      service.url = data.url
    }

    if (data.title_en) {
      service.title.en = data.title_en
    }
    if (data.title_fr) {
      service.title.fr = data.title_fr
    }

    if (data.description_en) {
      service.description.en = data.description_en
    }
    if (data.description_fr) {
      service.description.fr = data.description_fr
    }

    if (typeof data.icon !== 'undefined') {
      let iconPath: string | undefined
      if (data.icon) {
        const iconName = `${cuid()}.${data.icon.extname}`
        await data.icon.move(app.makePath('storage/uploads'), { name: iconName })
        iconPath = `storage/uploads/icons/${iconName}`
        service.icon = iconPath
      }
    }

    if (typeof data.isActive !== 'undefined') {
      service.isActive = data.isActive
    }
    service.updatedAt = new Date()
    return await this.serviceRepository.update(service)
  }
}
