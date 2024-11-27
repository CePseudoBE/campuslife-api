import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'
import { Service } from '#domain/entities/service'

@inject()
export class UpdateServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  public async handle(
    id: number,
    data: {
      title?: { en: string; fr: string }
      description?: { en: string; fr: string }
      url?: string
      icon?: string
      isActive?: boolean
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

    if (data.title) {
      if (data.title.en) {
        service.title.en = data.title.en
      }
      if (data.title.fr) {
        service.title.fr = data.title.fr
      }
    }

    if (data.description) {
      if (data.description.en) {
        service.description.en = data.description.en
      }
      if (data.description.fr) {
        service.description.fr = data.description.fr
      }
    }

    if (typeof data.icon !== 'undefined') {
      service.icon = data.icon
    }

    if (typeof data.isActive !== 'undefined') {
      service.isActive = data.isActive
    }
    service.updatedAt = new Date()
    return await this.serviceRepository.update(service)
  }
}
