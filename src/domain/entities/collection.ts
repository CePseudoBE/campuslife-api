import { Tag } from '#domain/entities/tag'
import type { MultilingualField } from '#domain/types/multilingual_field.type'

export class Collection {
  public id: number | null
  public name: MultilingualField
  public heroicons: string
  public tags?: Tag[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number | null,
    name: MultilingualField,
    heroicons: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    tags?: Tag[]
  ) {
    this.id = id

    if (!name.en || name.en.trim().length === 0) {
      throw new Error('InvalidTitleError: The English title must be provided and cannot be empty.')
    }
    if (!name.fr || name.fr.trim().length === 0) {
      throw new Error('InvalidTitleError: The French title must be provided and cannot be empty.')
    }

    this.name = name
    this.heroicons = heroicons
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.tags = tags
  }

  public delete() {
    this.deletedAt = new Date()
  }
}
