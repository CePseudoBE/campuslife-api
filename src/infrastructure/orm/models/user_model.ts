import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import EventModel from '#infrastructure/orm/models/event_model'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class UserModel extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare role: string

  @hasMany(() => EventModel, {
    foreignKey: 'idUser',
  })
  declare event: HasMany<typeof EventModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(UserModel)
}
