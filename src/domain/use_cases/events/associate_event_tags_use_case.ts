import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { IEventRepository } from '#domain/repositories/ievent_repository'
import { Event } from '#domain/entities/event'

@inject()
export class AssociateCollectionTagsUseCase {
  constructor(
    private iEventRepository: IEventRepository,
    private iTagRepository: ITagRepository
  ) {}

  public async handle(data: { id: number; tags: number[] | undefined }): Promise<Event> {
    if (!data.tags || data.tags.length === 0) {
      throw new Error('NoAssociation : 0 tag were provided, provide more tag')
    }

    if (!Array.isArray(data.tags) || data.tags.some((tag) => !Number.isInteger(tag))) {
      throw new Error('InvalidFormat: tags must be an array of numbers')
    }

    for (const tagId of data.tags) {
      const tag = await this.iTagRepository.findById(tagId, false)
      if (!tag) {
        throw new Error(`NotFound: Tag with ID ${tagId} does not exist`)
      }
    }

    const event = await this.iEventRepository.findById(data.id, false)

    if (!event) {
      throw new Error(`NotFound: event with ID ${data.id} does not exist`)
    }

    return await this.iEventRepository.associate_tags(data.tags, event)
  }
}
