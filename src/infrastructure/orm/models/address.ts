import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Event from '#infrastructure/orm/models/event'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Country from '#infrastructure/orm/models/country'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare street: string

  @column()
  declare num: string

  @column()
  declare complement: string | undefined

  @column()
  declare zip: string

  @column()
  declare city: string

  @column()
  declare idCountry: number

  @hasMany(() => Event)
  declare event: HasMany<typeof Event>

  @belongsTo(() => Country)
  declare country: BelongsTo<typeof Country>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
