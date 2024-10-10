import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { MultilingualField } from '#domain/types/multilingual_field.type'

export default class ServiceModel extends BaseModel {
  public static table = 'services'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: MultilingualField

  @column()
  declare description: MultilingualField

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

  @column.dateTime()
  declare deletedAt: DateTime | null
}
