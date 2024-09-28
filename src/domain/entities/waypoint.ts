import { Tag } from '#domain/entities/tag'
import { Event } from '#domain/entities/event'

export class Waypoint {
  public id: number | null
  public latitude: number
  public longitude: number
  public title: JSON
  public description?: JSON | undefined
  public types: string
  public pmr: boolean
  public slug?: string
  public tags?: Tag[]
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number | null,
    latitude: number,
    longitude: number,
    title: JSON,
    types: string,
    pmr: boolean,
    createdAt: Date,
    updatedAt: Date,
    description?: JSON | undefined,
    slug?: string | undefined,
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
  }
}
