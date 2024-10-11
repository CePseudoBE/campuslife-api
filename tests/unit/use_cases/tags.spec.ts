import { test } from '@japa/runner'
import { FindByIdTagUseCase } from '#domain/use_cases/tags/find_by_id_tag_use_case'
import { Tag } from '#domain/entities/tag'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { FindTagsUseCase } from '#domain/use_cases/tags/find_tags_use_case'
import { CreateTagUseCase } from '#domain/use_cases/tags/create_tag_use_case'
import { mockCollectionRepository } from '#tests/unit/use_cases/collections.spec'

// Mock du TagRepository
export const mockTagRepository: ITagRepository = {
  async findById(id: number, includes?: string[]): Promise<Tag> {
    // Simuler un Tag non trouvé pour certains IDs
    if (id === 999) {
      throw Error(`Tag with ID ${id} does not exist`) // Simule un Tag non trouvé
    }

    // Retourner un tag si l'ID est trouvé
    const tag = new Tag(
      id,
      { en: 'Test Tag', fr: 'Étiquette de test' },
      new Date(),
      new Date(),
      null
    )

    // Simuler l'inclusion des relations
    if (includes && includes.length > 0) {
      for (const relation of includes) {
        if (relation === 'waypoints') {
          tag.waypoints = [
            //@ts-ignore
            {
              id: 1,
              title: { en: 'Waypoint 1', fr: 'Point de passage 1' },
              latitude: 48.8566,
              longitude: 2.3522,
              types: 'type',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]
        }
        if (relation === 'events') {
          tag.events = [
            //@ts-ignore
            {
              id: 1,
              title: { fr: 'evenement', en: 'event' },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]
        }
      }
    }

    return tag
  },

  async create(tag: Tag): Promise<Tag> {
    // Simuler l'insertion et retourner le tag avec un ID
    tag.id = 1
    return tag
  },

  async associateCollections(collectionIds: number[], tag: Tag): Promise<Tag> {
    // Simuler l'association de collections au tag
    //@ts-ignore
    tag.collections = collectionIds.map((id) => ({
      id,
      name: { en: `Collection ${id}`, fr: `Collection ${id}` },
      heroicons: 'add',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }))
    return tag
  },
  async update(tag: Tag): Promise<Tag> {
    throw new Error('Not implemented in mock')
  },
  async delete(tag: Tag): Promise<null> {
    throw new Error('Not implemented in mock')
  },

  async findAll(queryParams: QueryParams, includes?: string[]): Promise<Tag[]> {
    const tags = [
      new Tag(
        1,
        { en: 'Test Tag 1', fr: 'Étiquette de test 1' },
        new Date('2024-01-01'),
        new Date('2024-01-01')
      ),
      new Tag(
        2,
        { en: 'Test Tag 2', fr: 'Étiquette de test 2' },
        new Date('2024-01-02'),
        new Date('2024-01-02')
      ),
    ]

    const sortedTags = tags.sort((a, b) => {
      if (queryParams.column === 'created_at') {
        const dateA = a.createdAt.getTime()
        const dateB = b.createdAt.getTime()

        return queryParams.order === 'asc' ? dateA - dateB : dateB - dateA
      }
      return 0
    })

    const page = queryParams.page ?? 1
    const limit = queryParams.limit ?? 10

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedTags = sortedTags.slice(startIndex, endIndex)

    if (includes && includes.length > 0) {
      paginatedTags.forEach((tag) => {
        if (includes.includes('waypoints')) {
          tag.waypoints = [
            //@ts-ignore
            {
              id: 1,
              title: { en: 'Waypoint 1', fr: 'Point de passage 1' },
              latitude: 48.8566,
              longitude: 2.3522,
              types: 'type',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]
        }
        if (includes.includes('events')) {
          tag.events = [
            //@ts-ignore
            {
              id: 1,
              title: { fr: 'evenement', en: 'event' },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]
        }
      })
    }

    return paginatedTags
  },
}

test.group('FindByIdTagUseCase', () => {
  test('should return a tag if it exists', async ({ assert }) => {
    const useCase = new FindByIdTagUseCase(mockTagRepository)

    const data = { id: 1 }
    const tag = await useCase.handle(data)

    assert.isNotNull(tag)
    assert.equal(tag?.id, 1)
    assert.equal(tag?.title.en, 'Test Tag')
  })

  test('should return null if the tag is not found', async ({ assert }) => {
    const useCase = new FindByIdTagUseCase(mockTagRepository)

    const data = { id: 999 } // ID invalide pour simuler un Tag non trouvé

    await assert.rejects(() => useCase.handle(data), `Tag with ID ${data.id} does not exist`)
  })

  test('should handle includes parameter properly', async ({ assert }) => {
    const useCase = new FindByIdTagUseCase(mockTagRepository)

    const data = { id: 1, includes: ['waypoints', 'events'] }
    const tag = await useCase.handle(data)

    assert.isNotNull(tag)
    assert.isArray(tag?.waypoints)
    assert.lengthOf(tag?.waypoints!, 1)
    assert.isArray(tag?.events)
    assert.lengthOf(tag?.events!, 1)
  })
})

test.group('FindTagsUseCase with filtering and pagination', () => {
  const queryValidationService = new QueryValidationService()

  test('should return tags sorted by created_at in ascending order', async ({ assert }) => {
    const useCase = new FindTagsUseCase(mockTagRepository, queryValidationService)
    const queryParams = {
      page: 1,
      limit: 10,
      order: 'asc' as 'asc' | 'desc', // Explicit cast to ensure correct type
      column: 'created_at',
    }
    const includes: string[] = []

    const tags = await useCase.handle(queryParams, includes)

    assert.isArray(tags)
    assert.lengthOf(tags, 2)
    assert.equal(tags[0].title.en, 'Test Tag 1')
    assert.equal(tags[1].title.en, 'Test Tag 2')
  })

  test('should return tags sorted by created_at in descending order', async ({ assert }) => {
    const useCase = new FindTagsUseCase(mockTagRepository, queryValidationService)

    const queryParams = {
      page: 1,
      limit: 10,
      order: 'desc' as 'desc' | 'asc',
      column: 'created_at',
    }
    const includes: string[] = []

    const tags = await useCase.handle(queryParams, includes)

    assert.isArray(tags)
    assert.lengthOf(tags, 2)
    assert.equal(tags[0].title.en, 'Test Tag 2')
    assert.equal(tags[1].title.en, 'Test Tag 1')
  })

  test('should apply pagination and return only the first page', async ({ assert }) => {
    const useCase = new FindTagsUseCase(mockTagRepository, queryValidationService)

    const queryParams = {
      page: 1,
      limit: 10,
      order: 'desc' as 'asc' | 'desc',
      column: 'created_at',
    }
    const includes: string[] = []

    const tags = await useCase.handle(queryParams, includes)

    assert.isArray(tags)
    assert.lengthOf(tags, 2)
    assert.equal(tags[0].title.en, 'Test Tag 2')
  })

  test('should apply pagination and return only the first page', async ({ assert }) => {
    const useCase = new FindTagsUseCase(mockTagRepository, queryValidationService)

    const queryParams = {
      page: 1,
      limit: 1,
      order: 'desc' as 'asc' | 'desc',
      column: 'created_at',
    }
    const includes: string[] = []

    const tags = await useCase.handle(queryParams, includes)

    assert.isArray(tags)
    assert.lengthOf(tags, 1)
    assert.equal(tags[0].title.en, 'Test Tag 2')
  })
})

test.group('CreateTagUseCase', () => {
  test('should create a tag without collections', async ({ assert }) => {
    const useCase = new CreateTagUseCase(mockTagRepository, mockCollectionRepository)

    const data = {
      title_en: 'Test Tag',
      title_fr: 'Étiquette de test',
      collections: [],
    }

    const tag = await useCase.handle(data)

    assert.isNotNull(tag)
    assert.equal(tag.id, 1)
    assert.equal(tag.title.en, 'Test Tag')
    assert.isUndefined(tag.collections)
  })

  test('should create a tag with valid collections', async ({ assert }) => {
    const useCase = new CreateTagUseCase(mockTagRepository, mockCollectionRepository)

    const data = {
      title_en: 'Test Tag',
      title_fr: 'Étiquette de test',
      collections: [1, 2],
    }

    const tag = await useCase.handle(data)

    assert.isNotNull(tag)
    assert.equal(tag.id, 1)
    assert.equal(tag.title.en, 'Test Tag')
    assert.lengthOf(tag.collections!, 2)
    assert.equal(tag.collections![0].id, 1)
    assert.equal(tag.collections![1].id, 2)
  })

  test('should throw an error if title is missing', async ({ assert }) => {
    const useCase = new CreateTagUseCase(mockTagRepository, mockCollectionRepository)

    const invalidData = {
      title_en: '', // Titre manquant en anglais
      title_fr: 'Étiquette de test',
    }

    await assert.rejects(() => useCase.handle(invalidData), 'Title is required')
  })

  test('should throw an error if collections are not an array of numbers', async ({ assert }) => {
    const useCase = new CreateTagUseCase(mockTagRepository, mockCollectionRepository)

    const invalidData = {
      title_en: 'Test Tag',
      title_fr: 'Étiquette de test',
      collections: ['invalid-collection'], // Format invalide pour les collections
    }

    await assert.rejects(
      //@ts-ignore
      () => useCase.handle(invalidData),
      'Invalid collection format: collections must be an array of numbers'
    )
  })

  test('should throw an error if a collection does not exist', async ({ assert }) => {
    const useCase = new CreateTagUseCase(mockTagRepository, mockCollectionRepository)

    const data = {
      title_en: 'Test Tag',
      title_fr: 'Étiquette de test',
      collections: [999], // Collection ID invalide
    }

    await assert.rejects(
      () => useCase.handle(data),
      'IdNotFound : Collection with ID 999 does not exist'
    )
  })
})
