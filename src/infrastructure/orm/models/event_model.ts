import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import AddressModel from '#infrastructure/orm/models/address_model'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import UserModel from '#infrastructure/orm/models/user_model'
import TagModel from '#infrastructure/orm/models/tag_model'

type MultilingualField = {
  en?: string
  fr?: string
}

export default class EventModel extends BaseModel {
  public static table = 'events'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: MultilingualField

  @column()
  declare description: MultilingualField

  @column()
  declare image: string

  @column()
  declare start: DateTime

  @column()
  declare end: DateTime

  @column()
  declare url: string

  @column()
  declare slug: string | undefined

  @column()
  declare waypointId: number

  @column()
  declare userId: number

  @column()
  declare addressId: number

  @manyToMany(() => TagModel, {
    pivotTable: 'events_tags',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof TagModel>

  @belongsTo(() => UserModel, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof UserModel>

  @belongsTo(() => AddressModel, {
    foreignKey: 'addressId',
  })
  declare address: BelongsTo<typeof AddressModel>

  @belongsTo(() => WaypointModel, {
    foreignKey: 'waypointId',
  })
  declare waypoint: BelongsTo<typeof WaypointModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
