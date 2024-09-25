import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Waypoint from '#infrastructure/orm/models/waypoint'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Event from '#infrastructure/orm/models/event'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titleJson: JSON

  @column()
  declare slugTitle: string

  @manyToMany(() => Waypoint)
  declare waypoints: ManyToMany<typeof Waypoint>

  @manyToMany(() => Event)
  declare events: ManyToMany<typeof Event>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
