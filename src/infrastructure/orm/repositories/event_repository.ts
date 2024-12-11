import { IEventRepository } from '#domain/repositories/ievent_repository'
import { inject } from '@adonisjs/core'
import { Event } from '#domain/entities/event'
import { EventMapper } from '#adapters/mappers/event_mapper'
import EventModel from '../models/event_model.js'
import { DateTime } from 'luxon'
import { QueryParams } from '#domain/services/sorting_validation'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
@inject()
export class EventRepository extends IEventRepository {
  constructor() {
    super()
  }

  async create(event: Event): Promise<Event> {
    const eventModel = EventMapper.toPersistence(event)
    await eventModel.save()
    return EventMapper.toDomain(eventModel)
  }

  async delete(event: Event): Promise<null> {
    if (!event.id) {
      throw new Error('NotFound: Event not found')
    }

    const eventModel = await EventModel.query()
      .whereNull('deleted_at')
      .andWhere('id', event.id)
      .first()

    if (!eventModel) {
      throw new Error('AlreadyDeleted: Event deleted')
    }

    eventModel.deletedAt = DateTime.fromJSDate(event.deletedAt!)

    await eventModel.save()
    return null
  }

  async findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Event[]> {
    const query = EventModel.query()

    if (!deleted) {
      query.whereNull('deleted_at')
    }

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    if (includes && includes.length > 0) {
      query.preload(includes[0] as ExtractModelRelations<EventModel>)
      for (let i = 1; i < includes.length; i++) {
        query.preload(includes[i] as ExtractModelRelations<EventModel>)
      }
    }
    const eventModels = await query.exec()

    return eventModels.map((event) => EventMapper.toDomain(event))
  }

  async findById(id: number, connected: boolean, includes?: string[]): Promise<Event> {
    const eventModel = await EventModel.findOrFail(id)
    if (!eventModel) {
      throw new Error(`NotFound: Event with id ${id} not found`)
    }

    if (!connected) {
      if (eventModel.deletedAt) throw new Error('AlreadyDeleted: Event deleted')
    }

    if (includes && includes.length > 0) {
      for (const relation of includes) {
        await eventModel.load(relation as ExtractModelRelations<EventModel>)
      }
    }

    return EventMapper.toDomain(eventModel)
  }

  async update(event: Event): Promise<Event> {
    if (!event.id) {
      throw new Error(`NotFound: Event not found`)
    }

    const eventModel = await EventModel.query()
      .whereNull('deleted_at')
      .andWhere('id', event.id)
      .first()

    if (!eventModel) {
      throw new Error('AlreadyDeleted: Event deleted')
    }

    eventModel.title = event.title
    eventModel.description = event.description
    eventModel.image = event.image
    eventModel.url = event.url
    eventModel.slug = event.slug
    eventModel.userId = event.userId
    eventModel.waypointId = event.waypointId
    eventModel.addressId = event.addressId

    await eventModel.save()

    return EventMapper.toDomain(eventModel)
  }

  async associate_tags(tagsId: number[], event: Event): Promise<Event> {
    const eventModel = await EventModel.find(event.id)
    if (!eventModel) {
      throw new Error(`NotFound: Event with id: ${event.id} not found`)
    }

    await eventModel.related('tags').sync(tagsId)

    await eventModel.load('tags')

    return EventMapper.toDomain(eventModel)
  }
}
