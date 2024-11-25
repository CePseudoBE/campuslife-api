import { Waypoint } from '#domain/entities/waypoint'
import { Event } from '#domain/entities/event'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { Collection } from '#domain/entities/collection'

export class Tag {
  public id: number | null
  public title: MultilingualField
  public waypoints?: Waypoint[]
  public events?: Event[]
  public collections?: Collection[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  public static allowedColumns: string[] = ['id', 'created_at', 'updated_at']

  constructor(
    id: number | null,
    title: MultilingualField,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    waypoints?: Waypoint[],
    events?: Event[],
    collections?: Collection[]
  ) {
    this.id = id

    if (!title.en || title.en.trim().length === 0) {
      throw new Error('InvalidFormat: The English title must be provided and cannot be empty.')
    }
    if (!title.fr || title.fr.trim().length === 0) {
      throw new Error('InvalidFormat: The French title must be provided and cannot be empty.')
    }

    this.title = title
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.waypoints = waypoints
    this.events = events
    this.collections = collections
  }

  public delete() {
    this.deletedAt = new Date()
  }

  public update(data: {
    title_en?: string
    title_fr?: string
    waypoints?: Waypoint[]
    events?: Event[]
    collections?: Collection[]
  }): void {
    this.waypoints = data.waypoints ?? this.waypoints
    this.events = data.events ?? this.events
    this.collections = data.collections ?? this.collections
    this.updatedAt = new Date()

    this.updateTitle(data)
  }

  private updateTitle(data: { title_en?: string; title_fr?: string }): void {
    if (data.title_en) {
      this.title.en = data.title_en
    }
    if (data.title_fr) {
      this.title.fr = data.title_fr
    }
  }
}
