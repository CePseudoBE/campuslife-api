import { Collection } from '#domain/entities/collection'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { QueryParams } from '#domain/services/sorting_validation'

// Mock complet du CollectionRepository
export const mockCollectionRepository: ICollectionRepository = {
  async create(collection: Collection): Promise<Collection> {
    // Simuler la création et retourner le collection avec un ID
    collection.id = 1
    return collection
  },

  async delete(collection: Collection): Promise<null> {
    // Simuler la suppression d'une collection
    if (!collection.id) {
      throw new Error(`IdNotFound : Collection with ID does not exist`)
    }
    if (collection.id === 999) {
      throw new Error('AlreadyDelete: Collection deleted')
    }
    return null
  },

  async findAll(queryParams: QueryParams, includes?: string[]): Promise<Collection[]> {
    // Simuler la récupération de toutes les collections avec pagination et tri
    const collections = [
      new Collection(
        1,
        { en: 'Collection 1', fr: 'Collection 1' },
        'test',
        new Date(),
        new Date(),
        null
      ),
      new Collection(
        2,
        { en: 'Collection 2', fr: 'Collection 2' },
        'test',
        new Date(),
        new Date(),
        null
      ),
    ]

    // Simuler le tri et la pagination
    const startIndex = (queryParams.page! - 1) * queryParams.limit!
    const endIndex = startIndex + queryParams.limit!
    const paginatedCollections = collections.slice(startIndex, endIndex)

    return paginatedCollections
  },

  async findById(id: number, includes?: string[]): Promise<Collection> {
    // Simuler la récupération d'une collection par ID
    if (id === 999) {
      throw new Error(`IdNotFound : Collection with ID ${id} does not exist`)
    }

    const collection = new Collection(
      id,
      { en: `Collection ${id}`, fr: `Collection ${id}` },
      'test',
      new Date(),
      new Date(),
      null
    )

    if (id === 1000) {
      collection.deletedAt = new Date() // Simuler une collection supprimée
      throw new Error('AlreadyDelete: Collection deleted')
    }

    return collection
  },

  async update(collection: Collection): Promise<Collection> {
    // Simuler la mise à jour d'une collection
    if (!collection.id || collection.id === 999) {
      throw new Error('NotFound: Collection not found')
    }

    collection.name = { en: 'Updated Collection', fr: 'Collection mise à jour' }
    collection.heroicons = 'new-heroicon'

    return collection
  },
}
