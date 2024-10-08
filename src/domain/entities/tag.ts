import { Waypoint } from '#domain/entities/waypoint'
import { Event } from '#domain/entities/event'
import { MultilingualField } from '#domain/types/multilingual_field.type'

export class Tag {
  public id: number | null
  public titleJson: MultilingualField
  public slugTitle: string
  public waypoints?: Waypoint[]
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  constructor(
    id: number | null,
    titleJson: MultilingualField,
    slugTitle: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    waypoints?: Waypoint[],
    events?: Event[]
  ) {
    this.id = id

    if (!titleJson.en || titleJson.en.trim().length === 0) {
      throw new Error('InvalidTitleError: The English title must be provided and cannot be empty.')
    }
    if (!titleJson.fr || titleJson.fr.trim().length === 0) {
      throw new Error('InvalidTitleError: The French title must be provided and cannot be empty.')
    }
    if (!slugTitle || slugTitle.trim().length === 0) {
      throw new Error('InvalidSlugError: The slugTitle cannot be empty.')
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slugTitle)) {
      throw new Error(
        'InvalidSlugFormatError: The slugTitle must only contain lowercase letters, numbers, and hyphens.'
      )
    }

    this.titleJson = titleJson
    this.slugTitle = slugTitle
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
    this.waypoints = waypoints
    this.events = events
  }

  public delete() {
    this.deletedAt = new Date()
  }
}
