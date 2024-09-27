import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Address_model from '#infrastructure/orm/models/address_model'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import UserModel from '#infrastructure/orm/models/user_model'
import TagModel from '#infrastructure/orm/models/tag_model'

export default class EventModel extends BaseModel {
  public static table = 'events'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titleJson: JSON

  @column()
  declare descriptionJson: JSON

  @column()
  declare image: string

  @column()
  declare start: DateTime

  @column()
  declare end: DateTime

  @column()
  declare url: string

  @column()
  declare slugTitle: string | undefined

  @column()
  declare idWaypoint: number

  @column()
  declare idUser: number

  @column()
  declare idAddress: number

  @manyToMany(() => TagModel)
  declare tags: ManyToMany<typeof TagModel>

  @belongsTo(() => UserModel)
  declare user: BelongsTo<typeof UserModel>

  @belongsTo(() => Address_model)
  declare address: BelongsTo<typeof Address_model>

  @belongsTo(() => WaypointModel)
  declare waypoint: BelongsTo<typeof WaypointModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
