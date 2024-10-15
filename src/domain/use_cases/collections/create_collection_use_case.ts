import { inject } from '@adonisjs/core'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { Collection } from '#domain/entities/collection'

@inject()
export class CreateCollectionUseCase {
  constructor(
    private iTagRepository: ITagRepository,
    private iCollectionRepository: ICollectionRepository
  ) {}

  public async handle(data: {
    name_en: string
    name_fr: string
    heroicons: string
    tags?: number[]
  }): Promise<Collection> {
    const name: MultilingualField = {
      en: data.name_en || '',
      fr: data.name_fr || '',
    }

    if (!data.name_en || !data.name_fr) {
      throw Error('Title is required')
    }

    const collection = new Collection(null, name, data.heroicons, new Date(), new Date())

    if (!data.tags || data.tags.length === 0) {
      return await this.iCollectionRepository.create(collection)
    }

    if (!Array.isArray(data.tags) || data.tags.some((tag) => !Number.isInteger(tag))) {
      throw new Error('Invalid collection format: tags must be an array of numbers')
    }

    for (const tagId of data.tags) {
      const tag = await this.iTagRepository.findById(tagId, false)
      if (!tag) {
        throw new Error(`IdNotFound : Collection with ID ${tagId} does not exist`)
      }
    }

    const collectionFromRepo = await this.iCollectionRepository.create(collection)

    return await this.iCollectionRepository.associate_tags(data.tags, collectionFromRepo)
  }
}
