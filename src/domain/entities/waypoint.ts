import { Tag } from '#domain/entities/tag'
import { Event } from '#domain/entities/event'
import { OptionalMultilingualField, MultilingualField } from '#domain/types/multilingual_field.type'

export class Waypoint {
  public id: number | null
  public latitude: number
  public longitude: number
  public title: MultilingualField
  public description?: OptionalMultilingualField
  public types: string
  public pmr: boolean
  public slug?: string
  public tags?: Tag[]
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  public static allowedColumns: string[] = [
    'id',
    'latitude',
    'longitude',
    'types',
    'created_at',
    'updated_at',
  ]

  constructor(
    id: number | null,
    latitude: number,
    longitude: number,
    title: MultilingualField,
    types: string,
    pmr: boolean | undefined,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    description?: OptionalMultilingualField,
    slug?: string,
    tags?: Tag[],
    events?: Event[]
  ) {
    if (latitude > 90 || latitude < -90) {
      throw Error('InvalidFormat: Latitude must be between -90 and 90')
    }
    if (longitude > 180 || longitude < -180) {
      throw Error('InvalidFormat: Longitude must be between -180 and 180')
    }

    if (!title.en || title.en.trim().length === 0) {
      throw new Error('InvalidFormat: The English title must be provided and cannot be empty.')
    }
    if (!title.fr || title.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French title must be provided and cannot be empty.')
    }

    if (!types || types.trim().length === 0) {
      throw new Error('InvalidFormat: The waypoint type must be provided and cannot be empty.')
    }

    if (!pmr) {
      pmr = false
    }

    this.id = id
    this.latitude = latitude
    this.longitude = longitude
    this.title = title
    this.description = description
    this.types = types
    this.pmr = pmr
    this.slug = slug
    this.tags = tags
    this.events = events
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public delete() {
    this.deletedAt = new Date()
  }

  public update(data: {
    latitude?: number
    longitude?: number
    title_en?: string
    title_fr?: string
    description_en?: string
    description_fr?: string
    types?: string
    pmr?: boolean
    slug?: string
  }): void {
    this.latitude = data.latitude ?? this.latitude
    this.longitude = data.longitude ?? this.longitude
    this.types = data.types ?? this.types
    this.pmr = data.pmr ?? this.pmr
    this.slug = data.slug ?? this.slug
    this.updatedAt = new Date()

    this.updateTitle(data)
    this.updateDescription(data)
  }

  private updateTitle(data: { title_en?: string; title_fr?: string }): void {
    if (data.title_en) {
      this.title.en = data.title_en
    }
    if (data.title_fr) {
      this.title.fr = data.title_fr
    }
  }

  private updateDescription(data: { description_en?: string; description_fr?: string }): void {
    if (!this.description) {
      this.description = {}
    }
    if (data.description_en) {
      this.description.en = data.description_en
    }
    if (data.description_fr) {
      this.description.fr = data.description_fr
    }
  }
}
