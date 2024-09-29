import EventModel from '#infrastructure/orm/models/event_model'
import { Event } from '#domain/entities/event'
import { DateTime } from 'luxon'
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
    eventModel.idWaypoint = event.idWaypoint
    eventModel.idUser = event.idUser
    eventModel.idAddress = event.idAddress
    return eventModel
  }

  static toDomain(eventModel: EventModel): Event {
    return new Event(
      eventModel.id,
      eventModel.titleJson,
      eventModel.descriptionJson,
      eventModel.image,
      eventModel.start.toJSDate(),
      eventModel.end.toJSDate(),
      eventModel.url,
      eventModel.idWaypoint,
      eventModel.idUser,
      eventModel.idAddress,
      eventModel.createdAt.toJSDate(),
      eventModel.updatedAt.toJSDate(),
      eventModel.slugTitle
    )
  }
}
