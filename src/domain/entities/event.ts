// src/domain/entities/Event.ts

export class Event {
  public id: number
  public title: Record<string, string>
  public description: Record<string, string>
  public image: string
  public start: Date
  public end: Date
  public url: string
  public slugTitle?: string
  public idWaypoint: number
  public idUser: number
  public idAddress: number
  public tags?: string[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    title: Record<string, string>,
    description: Record<string, string>,
    image: string,
    start: Date,
    end: Date,
    url: string,
    idWaypoint: number,
    idUser: number,
    idAddress: number,
    createdAt: Date,
    updatedAt: Date,
    slugTitle?: string,
    tags?: string[]
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.image = image
    this.start = start
    this.end = end
    this.url = url
    this.idWaypoint = idWaypoint
    this.idUser = idUser
    this.idAddress = idAddress
    this.slugTitle = slugTitle
    this.tags = tags
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
