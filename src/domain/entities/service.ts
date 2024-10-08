import { MultilingualField } from '#domain/types/multilingual_field.type'

export class Service {
  public id: number | null
  public titleJson: MultilingualField
  public descriptionJson: MultilingualField
  public url: string
  public icon: string | undefined
  public isActive: boolean
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number | null,
    titleJson: MultilingualField,
    descriptionJson: MultilingualField,
    url: string,
    icon: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null
  ) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    if (!urlRegex.test(url)) {
      throw new Error('InvalidURLError: The provided URL is not valid.')
    }

    if (!titleJson.en || titleJson.en.trim().length === 0) {
      throw new Error('InvalidTitleError: The English title must be provided and cannot be empty.')
    }
    if (!titleJson.fr || titleJson.fr.trim().length === 0) {
      throw new Error('InvalidTitleError: The French title must be provided and cannot be empty.')
    }

    if (!descriptionJson.en || descriptionJson.en.trim().length === 0) {
      throw new Error(
        'InvalidTitleError: The English description must be provided and cannot be empty.'
      )
    }
    if (!descriptionJson.fr || descriptionJson.fr.trim().length === 0) {
      throw new Error(
        'InvalidTitleError: The French description must be provided and cannot be empty.'
      )
    }

    this.id = id
    this.titleJson = titleJson
    this.descriptionJson = descriptionJson
    this.url = url
    this.icon = icon
    this.isActive = isActive
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
