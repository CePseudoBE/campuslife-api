import { MultilingualField } from '#domain/types/multilingual_field.type'

export class Service {
  public id: number | null
  public title: MultilingualField
  public description: MultilingualField
  public url: string
  public icon: string | undefined
  public isActive: boolean
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null
  public static allowedColumns: string[] = [
    'id',
    'title',
    'description',
    'url',
    'icon',
    'isActive',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]

  constructor(
    id: number | null,
    title: MultilingualField,
    description: MultilingualField,
    url: string,
    icon: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null
  ) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    if (!urlRegex.test(url)) {
      throw new Error('InvalidFormat: The provided URL is not valid.')
    }

    if (!title.en || title.en.trim().length === 0) {
      throw new Error('InvalidFormat: The English title must be provided and cannot be empty.')
    }
    if (!title.fr || title.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French title must be provided and cannot be empty.')
    }

    if (!description.en || description.en.trim().length === 0) {
      throw new Error(
        'InvalidFormat: The English description must be provided and cannot be empty.'
      )
    }
    if (!description.fr || description.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French description must be provided and cannot be empty.')
    }

    this.id = id
    this.title = title
    this.description = description
    this.url = url
    this.icon = icon
    this.isActive = isActive
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
