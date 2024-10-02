import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

type MultilingualField = {
  en?: string
  fr?: string
}

export default class ServiceModel extends BaseModel {
  public static table = 'services'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titleJson: MultilingualField

  @column()
  declare descriptionJson: MultilingualField

  @column()
  declare url: string

  @column()
  declare icon: string | undefined

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
