import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Tag from '#infrastructure/orm/models/tag'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#infrastructure/orm/models/user'
import Address from '#infrastructure/orm/models/address'
import Waypoint from '#infrastructure/orm/models/waypoint'

export default class Event extends BaseModel {
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

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Address)
  declare address: BelongsTo<typeof Address>

  @belongsTo(() => Waypoint)
  declare waypoint: BelongsTo<typeof Waypoint>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
