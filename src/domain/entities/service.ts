type MultilingualField = {
  en?: string
  fr?: string
}

export class Service {
  public id: number
  public titleJson: MultilingualField
  public descriptionJson: MultilingualField
  public url: string
  public icon: string | undefined
  public isActive: boolean
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number,
    titleJson: MultilingualField,
    descriptionJson: MultilingualField,
    url: string,
    icon: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null
  ) {
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
