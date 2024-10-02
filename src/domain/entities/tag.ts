import { Waypoint } from '#domain/entities/waypoint'
import { Event } from '#domain/entities/event'

type MultilingualField = {
  en?: string
  fr?: string
}

export class Tag {
  public id: number
  public titleJson: MultilingualField
  public slugTitle: string
  public waypoints?: Waypoint[]
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number,
    titleJson: MultilingualField,
    slugTitle: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    waypoints?: Waypoint[],
    events?: Event[]
  ) {
    this.id = id
    this.titleJson = titleJson
    this.slugTitle = slugTitle
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.waypoints = waypoints
    this.events = events
  }
}
