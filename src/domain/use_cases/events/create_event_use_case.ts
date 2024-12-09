import { inject } from '@adonisjs/core'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { IEventRepository } from '#domain/repositories/ievent_repository'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Event } from '#domain/entities/event'

@inject()
export class CreateEventUseCase {
  constructor(
    private iEventRepository: IEventRepository,
    private iTagRepository: ITagRepository
  ) {}

  public async handle(
    data: {
      title_en: string
      title_fr: string
      description_en: string
      description_fr: string
      image: string
      start: string
      end: string
      url: string
      slug?: string
      waypointId: number
      userId: number
      addressId: number
      tags?: number[]
    },
    imagePath?: string
  ): Promise<Event> {
    const title: MultilingualField = {
      en: data.title_en || '',
      fr: data.title_fr || '',
    }

    const description: MultilingualField = {
      en: data.description_en || '',
      fr: data.description_fr || '',
    }

    if (!data.title_en || !data.title_fr) {
      throw new Error('InvalidFormat: Title is required in both languages')
    }

    if (!data.start || !data.end) {
      throw new Error('InvalidFormat: Start and End dates are required')
    }

    const startDate = new Date(data.start)
    const endDate = new Date(data.end)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new Error('InvalidFormat: Start and End must be valid dates')
    }

    if (startDate >= endDate) {
      throw new Error('InvalidDateRange: Start date must be before End date')
    }

    const event = new Event(
      null,
      title,
      description,
      imagePath || '',
      startDate,
      endDate,
      data.url,
      data.waypointId,
      data.userId,
      data.addressId,
      new Date(),
      new Date(),
      null,
      data.slug || ''
    )

    if (data.tags && data.tags.length > 0) {
      if (!Array.isArray(data.tags) || data.tags.some((tag) => !Number.isInteger(tag))) {
        throw new Error('InvalidFormat: Tags must be an array of numbers')
      }

      for (const tagId of data.tags) {
        const tag = await this.iTagRepository.findById(tagId, false)
        if (!tag) {
          throw new Error(`NotFound: Tag with ID ${tagId} does not exist`)
        }
      }
    }

    const createdEvent = await this.iEventRepository.create(event)

    if (data.tags && data.tags.length > 0) {
      await this.iEventRepository.associate_tags(data.tags, createdEvent)
    }

    return createdEvent
  }
}
