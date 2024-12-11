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
    eventModel.title = event.title
    eventModel.description = event.description
    eventModel.image = event.image
    eventModel.start = DateTime.fromJSDate(event.start)
    eventModel.end = DateTime.fromJSDate(event.end)
    eventModel.url = event.url
    eventModel.slug = event.slug
    eventModel.deletedAt = event.deletedAt ? DateTime.fromJSDate(event.deletedAt) : null
    eventModel.waypointId = event.waypointId
    eventModel.userId = event.userId
    eventModel.addressId = event.addressId
    return eventModel
  }

  static toDomain(eventModel: EventModel): Event {
    const event = new Event(
      eventModel.id,
      eventModel.title,
      eventModel.description,
      eventModel.image,
      EventMapper.toDate(eventModel.start),
      EventMapper.toDate(eventModel.end),
      eventModel.url,
      eventModel.waypointId,
      eventModel.userId,
      eventModel.addressId,
      eventModel.createdAt.toJSDate(),
      eventModel.updatedAt.toJSDate(),
      eventModel.deletedAt ? eventModel.deletedAt.toJSDate() : null,
      eventModel.slug
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

  private static toDate(dateTime: DateTime): Date {
    return dateTime instanceof DateTime ? dateTime.toJSDate() : new Date(dateTime)
  }
}
