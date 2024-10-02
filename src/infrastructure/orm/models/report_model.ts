import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ReportModel extends BaseModel {
  public static table = 'reports'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionId: string

  @column()
  declare deviceId: string

  @column()
  declare message: string

  @column()
  declare contact: string | undefined

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
