import { Waypoint } from '#domain/entities/waypoint'
import { Event } from '#domain/entities/event'

export class Tag {
  public id: number
  public titleJson: JSON
  public slugTitle: string
  public waypoints?: Waypoint[]
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    titleJson: JSON,
    slugTitle: string,
    createdAt: Date,
    updatedAt: Date,
    waypoints?: Waypoint[],
    events?: Event[]
  ) {
    this.id = id
    this.titleJson = titleJson
    this.slugTitle = slugTitle
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.waypoints = waypoints
    this.events = events
  }
}
