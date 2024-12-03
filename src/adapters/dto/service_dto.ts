import { Service } from '#domain/entities/service'

type ServiceDTOType = {
  id: number
  title: string | { [key: string]: string }
  description: string | { [key: string]: string }
  url: string
  icon?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export class ServiceDTO {
  static toLanguages(service: Service, lang: 'fr' | 'en' | undefined): ServiceDTOType {
    const dto: ServiceDTOType = {
      id: service.id!,
      title: lang === undefined ? service.title : service.title[lang],
      description: lang === undefined ? service.description : service.description[lang],
      url: service.url,
      icon: service.icon ?? null,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      deletedAt: service.deletedAt ?? null,
    }

    return dto
  }
}
