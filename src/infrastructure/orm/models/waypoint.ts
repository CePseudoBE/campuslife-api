import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Waypoint extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare titleJson: JSON

  @column()
  declare descriptionJson: JSON | undefined

  @column()
  declare types: string

  @column()
  declare pmr: boolean

  @column()
  declare slug: string | undefined

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
