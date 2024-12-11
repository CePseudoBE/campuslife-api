import { inject } from '@adonisjs/core'
import { IEventRepository } from '#domain/repositories/ievent_repository'
import { Event } from '#domain/entities/event'
import { Tag } from '#domain/entities/tag'
import { MultipartFile } from '@adonisjs/core/bodyparser'

@inject()
export class UpdateEventUseCase {
  constructor(private iEventRepository: IEventRepository) {}

  public async handle(
    id: number,
    data: {
      title_en?: string
      title_fr?: string
      description_en?: string
      description_fr?: string
      image?: MultipartFile | undefined
      start?: string
      end?: string
      url?: string
      slug?: string
      waypointId?: number
      addressId?: number
      tags?: number[]
    },
    imagePath?: string
  ): Promise<Event> {
    const existingEvent = await this.iEventRepository.findById(id, false)
    if (!existingEvent) {
      throw new Error(`NotFound: Event with ID ${id} does not exist`)
    }

    if (data.start || data.end) {
      const startDate = data.start ? new Date(data.start) : existingEvent.start
      const endDate = data.end ? new Date(data.end) : existingEvent.end

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        throw new Error('InvalidFormat: Start and End must be valid dates')
      }

      if (startDate >= endDate) {
        throw new Error('InvalidDateRange: Start date must be before End date')
      }

      existingEvent.start = startDate
      existingEvent.end = endDate
    }

    existingEvent.update({}, imagePath)

    return await this.iEventRepository.update(existingEvent)
  }
}
