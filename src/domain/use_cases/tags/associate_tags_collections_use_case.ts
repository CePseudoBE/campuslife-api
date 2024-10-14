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
      throw new Error('NoAssocation : 0 tags were provided, provide more tags')
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
      const collection = await this.iCollectionRepository.findById(collectionId)
      if (!collection) {
        throw new Error(`Tag with ID ${collectionId} does not exist`)
      }
    }

    // Création du waypoint dans la base de données
    const tag = await this.iTagRepository.findById(data.id)

    if (!tag) {
      throw new Error(`Waypoint with ID ${data.id} does not exist`)
    }

    // Association des tags avec le waypoint
    return await this.iTagRepository.associateCollections(data.collections, tag)
  }
}
