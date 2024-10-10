import { Waypoint } from '#domain/entities/waypoint'
import { Event } from '#domain/entities/event'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { Collection } from '#domain/entities/collection'

export class Tag {
  public id: number | null
  public title: MultilingualField
  public slug: string
  public waypoints?: Waypoint[]
  public events?: Event[]
  public collections?: Collection[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number | null,
    title: MultilingualField,
    slug: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    waypoints?: Waypoint[],
    events?: Event[],
    collections?: Collection[]
  ) {
    this.id = id

    if (!title.en || title.en.trim().length === 0) {
      throw new Error('InvalidTitleError: The English title must be provided and cannot be empty.')
    }
    if (!title.fr || title.fr.trim().length === 0) {
      throw new Error('InvalidTitleError: The French title must be provided and cannot be empty.')
    }
    if (!slug || slug.trim().length === 0) {
      throw new Error('InvalidSlugError: The slugTitle cannot be empty.')
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      throw new Error(
        'InvalidSlugFormatError: The slugTitle must only contain lowercase letters, numbers, and hyphens.'
      )
    }

    this.title = title
    this.slug = slug
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.waypoints = waypoints
    this.events = events
    this.collections = collections
  }

  public delete() {
    this.deletedAt = new Date()
  }
}
