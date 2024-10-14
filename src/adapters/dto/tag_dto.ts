import { Tag } from '#domain/entities/tag'

type TagDTOType = {
  id: number
  title: string | { [key: string]: string }
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  waypoints?: any[]
  events?: any[]
  collections?: any[]
}

export class TagDTO {
  static toLanguages(tag: Tag, lang: 'fr' | 'en' | undefined, includes?: string[]): TagDTOType {
    const dto: TagDTOType = {
      id: tag.id!,
      title: lang === undefined ? tag.title : tag.title[lang],
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      deletedAt: tag.deletedAt ?? null,
    }

    if (includes?.includes('waypoints')) {
      dto.waypoints = tag.waypoints
    }

    if (includes?.includes('events')) {
      dto.events = tag.events
    }

    if (includes?.includes('collections')) {
      dto.collections = tag.collections
    }

    return dto
  }
}
