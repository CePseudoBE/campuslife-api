import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'
import { Service } from '#domain/entities/service'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

@inject()
export class CreateServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  public async handle(data: {
    title_en: string
    title_fr: string
    description_en: string
    description_fr: string
    url: string
    icon?: MultipartFile
    isActive: boolean
  }): Promise<Service> {
    const title: MultilingualField = {
      en: data.title_en || '',
      fr: data.title_fr || '',
    }
    const description: MultilingualField = {
      en: data.description_en || '',
      fr: data.description_fr || '',
    }
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    if (!urlRegex.test(data.url)) {
      throw new Error('InvalidFormat: The provided URL is not valid.')
    }

    if (!data.title_en || data.title_en.trim().length === 0) {
      throw new Error('InvalidFormat: The English title must be provided and cannot be empty.')
    }

    if (!data.title_fr || data.title_fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French title must be provided and cannot be empty.')
    }

    if (!data.description_en || data.description_en.trim().length === 0) {
      throw new Error(
        'InvalidFormat: The English description must be provided and cannot be empty.'
      )
    }

    if (!data.description_fr || data.description_fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French description must be provided and cannot be empty.')
    }

    let iconPath: string | undefined
    if (data.icon) {
      const iconName = `${cuid()}.${data.icon.extname}`
      await data.icon.move(app.makePath('storage/uploads'), { name: iconName })
      iconPath = `storage/uploads/icons/${iconName}`
    }

    const newService = new Service(
      null,
      title,
      description,
      data.url,
      iconPath,
      data.isActive,
      new Date(),
      new Date()
    )

    return await this.serviceRepository.create(newService)
  }
}
