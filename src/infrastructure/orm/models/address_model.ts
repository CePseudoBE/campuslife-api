import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import EventModel from '#infrastructure/orm/models/event_model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CountryModel from '#infrastructure/orm/models/country_model'

export default class AddressModel extends BaseModel {
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

  @hasMany(() => EventModel)
  declare event: HasMany<typeof EventModel>

  @belongsTo(() => CountryModel)
  declare country: BelongsTo<typeof CountryModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
