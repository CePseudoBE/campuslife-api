import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import EventModel from '#infrastructure/orm/models/event_model'

export default class TagModel extends BaseModel {
  public static table = 'tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titleJson: JSON

  @column()
  declare slugTitle: string

  @manyToMany(() => WaypointModel, {
    pivotTable: 'waypoints_tags',
    pivotForeignKey: 'id_waypoint',
    pivotRelatedForeignKey: 'id_tag',
  })
  declare waypoints: ManyToMany<typeof WaypointModel>

  @manyToMany(() => EventModel, {
    pivotTable: 'event_tag',
    pivotForeignKey: 'id_event',
    pivotRelatedForeignKey: 'id_tag',
  })
  declare events: ManyToMany<typeof EventModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
