import TagModel from '#infrastructure/orm/models/tag_model'
import { Tag } from '#domain/entities/tag'
import { EventMapper } from '#adapters/mappers/event_mapper'
import { WaypointMapper } from '#adapters/mappers/waypoint_mapper'

export class TagMapper {
  static toPersistence(tag: Tag): TagModel {
    const tagModel = new TagModel()
    tagModel.titleJson = tag.titleJson
    tagModel.slugTitle = tag.slugTitle
    return tagModel
  }

  static toDomain(tagModel: TagModel): Tag {
    const tag = new Tag(
      tagModel.id,
      tagModel.titleJson,
      tagModel.slugTitle,
      tagModel.createdAt.toJSDate(),
      tagModel.updatedAt.toJSDate()
    )

    if (tagModel.events) {
      tag.events = tagModel.events
        ? tagModel.events.map((eventModel) => EventMapper.toDomain(eventModel))
        : []
    }

    if (tagModel.waypoints) {
      tag.waypoints
        ? tagModel.waypoints.map((waypointModel) => WaypointMapper.toDomain(waypointModel))
        : []
    }

    return tag
  }
}
