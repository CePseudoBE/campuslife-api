import { Event } from '#domain/entities/event'

export class EventDTO {
  static toDTO(event: Event) {
    return {
      id: event.id,
      title: event.titleJson,
      startDate: event.start,
      endDate: event.end,
      user: event.idUser,
    }
  }
}
