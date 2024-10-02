import { Tag } from '#domain/entities/tag'
import { Event } from '#domain/entities/event'

type MultilingualField = {
  en?: string
  fr?: string
}

export class Waypoint {
  public id: number | null
  public latitude: number
  public longitude: number
  public title: MultilingualField
  public description?: MultilingualField
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
    pmr: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    description?: MultilingualField,
    slug?: string,
    tags?: Tag[],
    events?: Event[]
  ) {
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
