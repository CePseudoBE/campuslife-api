import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AddressModel from '#infrastructure/orm/models/address_model'

export default class CountryModel extends BaseModel {
  public static table = 'countries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare iso: string

  @hasMany(() => AddressModel, {
    foreignKey: 'countryId',
  })
  declare addresses: HasMany<typeof AddressModel>
}
