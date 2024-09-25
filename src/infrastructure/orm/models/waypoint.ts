import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from '#infrastructure/orm/models/tag'
import Event from '#infrastructure/orm/models/event'

export default class Waypoint extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare titleJson: JSON

  @column()
  declare descriptionJson: JSON | undefined

  @column()
  declare types: string

  @column()
  declare pmr: boolean

  @column()
  declare slug: string | undefined

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @hasMany(() => Event)
  declare event: HasMany<typeof Event>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
