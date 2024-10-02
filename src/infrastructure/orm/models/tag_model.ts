import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import EventModel from '#infrastructure/orm/models/event_model'

type MultilingualField = {
  en?: string
  fr?: string
}

export default class TagModel extends BaseModel {
  public static table = 'tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titleJson: MultilingualField

  @column()
  declare slugTitle: string

  @manyToMany(() => WaypointModel, {
    pivotTable: 'waypoints_tags',
    pivotForeignKey: 'waypoint_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare waypoints: ManyToMany<typeof WaypointModel>

  @manyToMany(() => EventModel, {
    pivotTable: 'event_tag',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare events: ManyToMany<typeof EventModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime
}
