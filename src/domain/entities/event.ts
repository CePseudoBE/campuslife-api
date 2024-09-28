// src/domain/entities/Event.ts

import { Tag } from '#domain/entities/tag'
import { Waypoint } from '#domain/entities/waypoint'
import { User } from '#domain/entities/user'
import { Address } from '#domain/entities/address'

export class Event {
  public id: number
  public title: JSON
  public description: JSON
  public image: string
  public start: Date
  public end: Date
  public url: string
  public slugTitle?: string
  public idWaypoint: number
  public idUser: number
  public idAddress: number
  public waypoint?: Waypoint
  public user?: User
  public address?: Address
  public tags?: Tag[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    title: JSON,
    description: JSON,
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
    waypoint?: Waypoint,
    user?: User,
    address?: Address,
    tags?: Tag[]
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
    this.waypoint = waypoint
    this.user = user
    this.address = address
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
