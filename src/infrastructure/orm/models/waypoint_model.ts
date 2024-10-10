import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import EventModel from '#infrastructure/orm/models/event_model'
import TagModel from '#infrastructure/orm/models/tag_model'
import type {
  MultilingualField,
  OptionalMultilingualField,
} from '#domain/types/multilingual_field.type'

export default class WaypointModel extends BaseModel {
  public static table = 'waypoints'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare title: MultilingualField

  @column()
  declare description: OptionalMultilingualField | undefined

  @column()
  declare types: string

  @column()
  declare pmr: boolean

  @column()
  declare slug: string | undefined

  @manyToMany(() => TagModel, {
    pivotTable: 'waypoints_tags',
    pivotForeignKey: 'waypoint_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof TagModel>

  @hasMany(() => EventModel, {
    foreignKey: 'waypointId',
  })
  declare events: HasMany<typeof EventModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
