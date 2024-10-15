import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class AssociateTagsCollectionsUseCase {
  constructor(
    private iCollectionRepository: ICollectionRepository,
    private iTagRepository: ITagRepository
  ) {}

  public async handle(data: { id: number; collections: number[] | undefined }): Promise<Tag> {
    if (!data.collections || data.collections.length === 0) {
      throw new Error('NoAssocation : 0 collection were provided, provide collection tags')
    }

    // Validation des tags
    if (
      !Array.isArray(data.collections) ||
      data.collections.some((collection) => !Number.isInteger(collection))
    ) {
      throw new Error('Invalid collection format: collections must be an array of numbers')
    }

    // Vérification de l'existence des tags
    for (const collectionId of data.collections) {
      const collection = await this.iCollectionRepository.findById(collectionId, false)
      if (!collection) {
        throw new Error(`Tag with ID ${collectionId} does not exist`)
      }
    }

    // Création du waypoint dans la base de données
    const tag = await this.iTagRepository.findById(data.id, false)

    if (!tag) {
      throw new Error(`NotFound: Tag with ID ${data.id} does not exist`)
    }

    return await this.iTagRepository.associateCollections(data.collections, tag)
  }
}
