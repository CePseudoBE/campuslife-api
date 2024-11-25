import { inject } from '@adonisjs/core'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'

@inject()
export class CreateTagUseCase {
  constructor(
    private iTagRepository: ITagRepository,
    private iCollectionRepository: ICollectionRepository
  ) {}

  public async handle(data: {
    title_en: string
    title_fr: string
    collections?: number[]
  }): Promise<Tag> {
    const title: MultilingualField = {
      en: data.title_en || '',
      fr: data.title_fr || '',
    }

    if (!data.title_en || !data.title_fr) {
      throw Error('InvalidFormat: Title is required')
    }

    const tag = new Tag(null, title, new Date(), new Date())

    if (!data.collections || data.collections.length === 0) {
      return await this.iTagRepository.create(tag)
    }

    if (
      !Array.isArray(data.collections) ||
      data.collections.some((collection) => !Number.isInteger(collection))
    ) {
      throw new Error('InvalidFormat: collections must be an array of numbers')
    }

    for (const collectionId of data.collections) {
      const collection = await this.iCollectionRepository.findById(collectionId, false)
      if (!collection) {
        throw new Error(`NotFound: Collection with ID ${collectionId} does not exist`)
      }
    }

    const tagFromRepo = await this.iTagRepository.create(tag)

    return await this.iTagRepository.associateCollections(data.collections, tagFromRepo)
  }
}
