import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class StibShapeModel extends BaseModel {
  public static table = 'stib_shapes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ligne: string

  @column()
  declare colorHex: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
