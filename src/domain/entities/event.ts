// src/domain/entities/Event.ts

import { Tag } from '#domain/entities/tag'
import { Waypoint } from '#domain/entities/waypoint'
import { User } from '#domain/entities/user'
import { Address } from '#domain/entities/address'

type MultilingualField = {
  en?: string
  fr?: string
}

export class Event {
  public id: number
  public titleJson: MultilingualField
  public descriptionJson: MultilingualField
  public image: string
  public start: Date
  public end: Date
  public url: string
  public slugTitle?: string
  public waypointId: number
  public userId: number
  public addressId: number
  public waypoint?: Waypoint
  public user?: User
  public address?: Address
  public tags?: Tag[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number,
    titleJson: MultilingualField,
    descriptionJson: MultilingualField,
    image: string,
    start: Date,
    end: Date,
    url: string,
    waypointId: number,
    userId: number,
    addressId: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    slugTitle?: string,
    waypoint?: Waypoint,
    user?: User,
    address?: Address,
    tags?: Tag[]
  ) {
    this.id = id
    this.titleJson = titleJson
    this.descriptionJson = descriptionJson
    this.image = image
    this.start = start
    this.end = end
    this.url = url
    this.waypointId = waypointId
    this.userId = userId
    this.addressId = addressId
    this.slugTitle = slugTitle
    this.tags = tags
    this.waypoint = waypoint
    this.user = user
    this.address = address
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
