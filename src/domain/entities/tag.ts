export class Tag {
  public id: number
  public title: Record<string, string>
  public slugTitle: string
  public waypoints?: string[]
  public events?: string[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    title: Record<string, string>,
    slugTitle: string,
    createdAt: Date,
    updatedAt: Date,
    waypoints?: string[],
    events?: string[]
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
