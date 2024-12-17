import TagModel from '#infrastructure/orm/models/tag_model'
import { Tag } from '#domain/entities/tag'
import { EventMapper } from '#adapters/mappers/event_mapper'
import { WaypointMapper } from '#adapters/mappers/waypoint_mapper'
import { DateTime } from 'luxon'
import { CollectionMapper } from '#adapters/mappers/collection_mapper'

export class TagMapper {
  static toPersistence(tag: Tag): TagModel {
    const tagModel = new TagModel()
    tagModel.title = tag.title
    tagModel.deletedAt = tag.deletedAt ? DateTime.fromJSDate(tag.deletedAt) : null
    return tagModel
  }

  static toDomain(tagModel: TagModel): Tag {
    const tag = new Tag(
      tagModel.id,
      tagModel.title,
      TagMapper.toDate(tagModel.createdAt),
      TagMapper.toDate(tagModel.updatedAt),
      tagModel.deletedAt ? tagModel.deletedAt.toJSDate() : null
    )

    if (tagModel.events) {
      tag.events = tagModel.events
        ? tagModel.events.map((eventModel) => EventMapper.toDomain(eventModel))
        : []
    }

    if (tagModel.waypoints) {
      tag.waypoints = tagModel.waypoints
        ? tagModel.waypoints.map((waypointModel) => WaypointMapper.toDomain(waypointModel))
        : []
    }

    if (tagModel.collections) {
      tag.collections = tagModel.collections
        ? tagModel.collections.map((collectionModel) => CollectionMapper.toDomain(collectionModel))
        : []
    }

    return tag
  }
  private static toDate(dateTime: DateTime): Date {
    return dateTime instanceof DateTime ? dateTime.toJSDate() : new Date(dateTime)
  }
}
