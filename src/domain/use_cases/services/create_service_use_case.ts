import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'
import { Service } from '#domain/entities/service'
import { MultilingualField } from '#domain/types/multilingual_field.type'

@inject()
export class CreateServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  public async handle(data: {
    title: MultilingualField
    description: MultilingualField
    url: string
    icon?: string
    isActive: boolean
  }): Promise<Service> {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    if (!urlRegex.test(data.url)) {
      throw new Error('InvalidFormat: The provided URL is not valid.')
    }

    if (!data.title.en || data.title.en.trim().length === 0) {
      throw new Error('InvalidFormat: The English title must be provided and cannot be empty.')
    }

    if (!data.title.fr || data.title.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French title must be provided and cannot be empty.')
    }

    if (!data.description.en || data.description.en.trim().length === 0) {
      throw new Error(
        'InvalidFormat: The English description must be provided and cannot be empty.'
      )
    }

    if (!data.description.fr || data.description.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French description must be provided and cannot be empty.')
    }
    const newService = new Service(
      null,
      data.title,
      data.description,
      data.url,
      data.icon,
      data.isActive,
      new Date(),
      new Date()
    )

    return await this.serviceRepository.create(newService)
  }
}
