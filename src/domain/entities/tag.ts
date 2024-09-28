import { Waypoint } from '#domain/entities/waypoint'
import { Event } from '#domain/entities/event'

export class Tag {
  public id: number
  public title: JSON
  public slugTitle: string
  public waypoints?: Waypoint[]
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    title: JSON,
    slugTitle: string,
    createdAt: Date,
    updatedAt: Date,
    waypoints?: Waypoint[],
    events?: Event[]
  ) {
    this.id = id
    this.title = title
    this.slugTitle = slugTitle
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.waypoints = waypoints
    this.events = events
  }
}
