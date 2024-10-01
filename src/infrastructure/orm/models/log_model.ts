import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LogModel extends BaseModel {
  public static table = 'logs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionId: string

  @column()
  declare userId: string

  @column()
  declare actionState: string

  @column()
  declare actionType: string

  @column()
  declare actionInfo: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
