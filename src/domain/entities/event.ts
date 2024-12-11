// src/domain/entities/Event.ts

import { Tag } from '#domain/entities/tag'
import { Waypoint } from '#domain/entities/waypoint'
import { User } from '#domain/entities/user'
import { Address } from '#domain/entities/address'
import { MultipartFile } from '@adonisjs/core/bodyparser'

type MultilingualField = {
  en?: string
  fr?: string
}

export class Event {
  public id: number | null
  public title: MultilingualField
  public description: MultilingualField
  public image: string
  public start: Date
  public end: Date
  public url: string
  public slug?: string
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

  public static allowedColumns: string[] = [
    'id',
    'title',
    'description',
    'url',
    'created_at',
    'updated_at',
    'start',
    'end',
  ]
  constructor(
    id: number | null,
    title: MultilingualField,
    description: MultilingualField,
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
    slug?: string,
    waypoint?: Waypoint,
    user?: User,
    address?: Address,
    tags?: Tag[]
  ) {
    if (!title.en || title.en.trim().length === 0) {
      throw new Error('InvalidFormat: The English title must be provided and cannot be empty.')
    }
    if (!title.fr || title.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French title must be provided and cannot be empty.')
    }

    if (!description.en || description.en.trim().length === 0) {
      throw new Error(
        'InvalidFormat: The English description must be provided and cannot be empty.'
      )
    }
    if (!description.fr || description.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French description must be provided and cannot be empty.')
    }
    if (start.getTime() <= Date.now()) {
      throw new Error('InvalidFormat: Start date must be in the future.')
    }
    if (end.getTime() <= start.getTime()) {
      throw new Error('InvalidFormat: End date must be after the start date.')
    }
    const urlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].\S*$/i
    if (url && !urlRegex.test(url)) {
      throw new Error('InvalidFormat: The provided URL is not valid.')
    }
    if (tags && new Set(tags.map((tag) => tag.id)).size !== tags.length) {
      throw new Error('LimitExceeded: Each tag must be unique.')
    }
    this.id = id
    this.title = title
    this.description = description
    this.image = image
    this.start = start
    this.end = end
    this.url = url
    this.waypointId = waypointId
    this.userId = userId
    this.addressId = addressId
    this.slug = slug
    this.tags = tags
    this.waypoint = waypoint
    this.user = user
    this.address = address
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
  public delete() {
    this.deletedAt = new Date()
  }

  public update(
    data: {
      title_en?: string
      title_fr?: string
      description_en?: string
      description_fr?: string
      image?: MultipartFile
      start?: string
      end?: string
      url?: string
      slug?: string
      waypointId?: number
      addressId?: number
      tags?: number[]
    },
    imagePath?: string
  ): void {
    if (data.title_en) this.title.en = data.title_en
    if (data.title_fr) this.title.fr = data.title_fr
    if (data.description_en) this.description.en = data.description_en
    if (data.image) this.image = imagePath || ''
    if (data.start) this.start = new Date(data.start)
    if (data.end) this.end = new Date(data.end)
    if (data.url) this.url = data.url
    if (data.slug) this.slug = data.slug
    if (data.waypointId !== undefined) this.waypointId = data.waypointId
    if (data.addressId !== undefined) this.addressId = data.addressId
    // TODO : add Update for tags

    this.updatedAt = new Date()
  }
}
