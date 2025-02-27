import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import EventModel from '#infrastructure/orm/models/event_model'
import type { MultilingualField } from '#domain/types/multilingual_field.type'
import CollectionModel from '#infrastructure/orm/models/collection_model'

export default class TagModel extends BaseModel {
  public static table = 'tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: MultilingualField

  @manyToMany(() => WaypointModel, {
    pivotTable: 'waypoints_tags',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'waypoint_id',
  })
  declare waypoints: ManyToMany<typeof WaypointModel>

  @manyToMany(() => EventModel, {
    pivotTable: 'events_tags',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'event_id',
  })
  declare events: ManyToMany<typeof EventModel>

  @manyToMany(() => CollectionModel, {
    pivotTable: 'tags_collections',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'collection_id',
  })
  declare collections: ManyToMany<typeof CollectionModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
