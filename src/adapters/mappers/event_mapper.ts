import EventModel from '#infrastructure/orm/models/event_model'
import { Event } from '#domain/entities/event'
import { DateTime } from 'luxon'
import { TagMapper } from '#adapters/mappers/tag_mapper'
import { UserMapper } from '#adapters/mappers/user_mapper'
import { AddressMapper } from '#adapters/mappers/address_mapper'
import { WaypointMapper } from '#adapters/mappers/waypoint_mapper'
export class EventMapper {
  static toPersistence(event: Event): EventModel {
    const eventModel = new EventModel()
    eventModel.titleJson = event.titleJson
    eventModel.descriptionJson = event.descriptionJson
    eventModel.image = event.image
    eventModel.start = DateTime.fromJSDate(event.start)
    eventModel.end = DateTime.fromJSDate(event.end)
    eventModel.url = event.url
    eventModel.slugTitle = event.slugTitle
    eventModel.waypointId = event.waypointId
    eventModel.userId = event.userId
    eventModel.addressId = event.addressId
    return eventModel
  }

  static toDomain(eventModel: EventModel): Event {
    const event = new Event(
      eventModel.id,
      eventModel.titleJson,
      eventModel.descriptionJson,
      eventModel.image,
      eventModel.start.toJSDate(),
      eventModel.end.toJSDate(),
      eventModel.url,
      eventModel.waypointId,
      eventModel.userId,
      eventModel.addressId,
      eventModel.createdAt.toJSDate(),
      eventModel.updatedAt.toJSDate(),
      eventModel.deletedAt ? eventModel.deletedAt.toJSDate() : null,
      eventModel.slugTitle
    )

    if (eventModel.tags) {
      event.tags = eventModel.tags
        ? eventModel.tags.map((tagModel) => TagMapper.toDomain(tagModel))
        : []
    }

    if (eventModel.user) {
      event.user = eventModel.user ? UserMapper.toDomain(eventModel.user) : undefined
    }

    if (eventModel.address) {
      event.address = eventModel.address ? AddressMapper.toDomain(eventModel.address) : undefined
    }

    if (eventModel.waypoint) {
      event.waypoint = eventModel.waypoint
        ? WaypointMapper.toDomain(eventModel.waypoint)
        : undefined
    }

    return event
  }
}
