import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import TagModel from '#infrastructure/orm/models/tag_model'
import type { MultilingualField } from '#domain/types/multilingual_field.type'

export default class CollectionModel extends BaseModel {
  public static table = 'tags'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: MultilingualField

  @column()
  declare heroicons: string

  @manyToMany(() => TagModel, {
    pivotTable: 'tags_collections',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'collection_id',
  })
  declare tags: ManyToMany<typeof TagModel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
