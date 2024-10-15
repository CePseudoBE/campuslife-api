import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { Collection } from '#domain/entities/collection'

@inject()
export class AssociateCollectionTagsUseCase {
  constructor(
    private iCollectionRepository: ICollectionRepository,
    private iTagRepository: ITagRepository
  ) {}

  public async handle(data: { id: number; tags: number[] | undefined }): Promise<Collection> {
    if (!data.tags || data.tags.length === 0) {
      throw new Error('NoAssocation : 0 tag were provided, provide more tag')
    }

    // Validation des tags
    if (!Array.isArray(data.tags) || data.tags.some((tag) => !Number.isInteger(tag))) {
      throw new Error('Invalid collection format: tags must be an array of numbers')
    }

    // Vérification de l'existence des tags
    for (const tagId of data.tags) {
      const tag = await this.iTagRepository.findById(tagId)
      if (!tag) {
        throw new Error(`Tag with ID ${tagId} does not exist`)
      }
    }

    const collection = await this.iCollectionRepository.findById(data.id)

    if (!collection) {
      throw new Error(`NotFound: Collection with ID ${data.id} does not exist`)
    }

    return await this.iCollectionRepository.associate_tags(data.tags, collection)
  }
}
