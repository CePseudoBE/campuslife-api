import { Collection } from '#domain/entities/collection'

type CollectionDTOType = {
  id: number
  name: string | { [key: string]: string }
  heroicons: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  tags?: any[]
}

export class CollectionDTO {
  static toLanguages(
    collection: Collection,
    lang: 'fr' | 'en' | undefined,
    includes?: string[]
  ): CollectionDTOType {
    const dto: CollectionDTOType = {
      id: collection.id!,
      name: lang === undefined ? collection.name : collection.name[lang],
      heroicons: collection.heroicons,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      deletedAt: collection.deletedAt ?? null,
    }

    if (includes?.includes('tags')) {
      dto.tags = collection.tags
    }

    return dto
  }
}
