import { test } from '@japa/runner'
import { Waypoint } from '#domain/entities/waypoint'
import { ISlugService } from '#domain/services/islug_service'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { CreateWaypointUseCase } from '#domain/use_cases/waypoints/create_waypoint_use_case'
import { UpdateWaypointUseCase } from '#domain/use_cases/waypoints/update_waypoint_use_case'
import string from '@adonisjs/core/helpers/string'
import { mockTagRepository } from '#tests/unit/use_cases/tags.spec'
import { Tag } from '#domain/entities/tag'
import { FindSlugWaypointUseCase } from '#domain/use_cases/waypoints/find_slug_waypoint_use_case'
import { WaypointTagsAssociateUseCase } from '#domain/use_cases/waypoints/waypoint_tags_associate_use_case'

export const mockWaypointRepository: IWaypointRepository = {
  async create(waypoint: Waypoint): Promise<Waypoint> {
    if (waypoint.latitude === 0) {
      // Simuler une erreur si latitude est 0
      throw new Error('Invalid latitude')
    }
    waypoint.id = 1
    return waypoint
  },

  async findById(id: number): Promise<Waypoint | null> {
    // Simuler un Waypoint non trouvé pour certains IDs
    if (id === 999) {
      return null // Simule un Waypoint non trouvé
    }

    // Retourner un waypoint si l'ID est trouvé
    return new Waypoint(
      id,
      48.8566,
      2.3522,
      { en: 'Test Title', fr: 'Titre de test' },
      'type',
      true,
      new Date(),
      new Date()
    )
  },

  async update(waypoint: Waypoint): Promise<Waypoint> {
    if (!waypoint.id || waypoint.id === 999) {
      // Simuler une erreur si l'ID est 999
      throw new Error('Waypoint not found')
    }

    waypoint.title.en = 'Updated Title'
    return waypoint
  },

  async delete(waypoint: Waypoint): Promise<null> {
    if (waypoint.id === 999) {
      throw new Error('Waypoint not found')
    }
    waypoint.deletedAt = new Date()
    return null
  },

  async findAll(): Promise<Waypoint[]> {
    return [
      new Waypoint(
        1,
        48.8566,
        2.3522,
        { en: 'Test Title', fr: 'Titre de test' },
        'type',
        true,
        new Date(),
        new Date()
      ),
    ]
  },

  async findBySlug(slug: string, includes?: string[]): Promise<Waypoint | null> {
    // Define some mock waypoints with related tags
    const waypoints = [
      new Waypoint(
        1,
        48.8566,
        2.3522,
        { en: 'Test Title', fr: 'Titre de test' },
        'type',
        true,
        new Date(),
        new Date(),
        null,
        { en: 'Test Description', fr: 'Description de test' },
        'test-title',
        [] // No tags initially
      ),
      new Waypoint(
        2,
        51.5074,
        -0.1278,
        { en: 'Another Title', fr: 'Un autre titre' },
        'type',
        true,
        new Date(),
        new Date(),
        null,
        { en: 'Another Description', fr: 'Autre description' },
        'another-title',
        [] // No tags initially
      ),
    ]

    // Find the waypoint by slug
    const waypoint = waypoints.find((w) => w.slug === slug)

    if (!waypoint) {
      return null
    }

    // Simulate loading relations based on the `includes` array
    if (includes && includes.length > 0) {
      for (const relation of includes) {
        if (relation === 'tags') {
          // Simulate loading related tags
          waypoint.tags = [
            //@ts-ignore
            {
              id: 1,
              title: { en: 'Tag 1', fr: 'Étiquette 1' },
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              waypoints: [],
              events: [],
            },
            //@ts-ignore
            {
              id: 2,
              title: { en: 'Tag 2', fr: 'Étiquette 2' },
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
              waypoints: [],
              events: [],
            },
          ]
        }
      }
    }

    return waypoint
  },

  async associateTags(idTags: number[], waypoint: Waypoint): Promise<Waypoint> {
    //@ts-ignore
    const mockTagData: Tag[] = idTags.map((id) => ({
      id,
      titleJson: { en: `Tag ${id}`, fr: `Étiquette ${id}` },
      slugTitle: `tag-${id}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: `Description for Tag ${id}`,
      deletedAt: null,
      waypoints: [],
      events: [],
      delete: function () {
        // @ts-ignore
        this.deletedAt = new Date()
      },
    }))

    // Simulate finding the waypoint
    if (!waypoint.id) {
      throw new Error('Waypoint not found')
    }

    // Assign the mock tags to the waypoint's tags property
    waypoint.tags = mockTagData

    // Return the updated waypoint
    return waypoint
  },
}

const mockSlugService: ISlugService = {
  generate: (title: string) => `slug-for-${title.toLowerCase().replace(/ /g, '-')}`,
  slugWithRandom: (slug: string) => string.slug(slug, { lower: true }),
}

test.group('CreateWaypointUseCase', () => {
  test('should create a new waypoint with a slug using the use case', async ({ assert }) => {
    const useCase = new CreateWaypointUseCase(
      mockWaypointRepository,
      mockTagRepository,
      mockSlugService
    )

    const data = {
      latitude: 48.8566,
      longitude: 2.3522,
      title_en: 'Test Title',
      title_fr: 'Titre de test',
      description_en: 'Test Description',
      description_fr: 'Description de test',
      types: 'type',
      pmr: true,
    }

    const waypoint = await useCase.handle(data)

    assert.equal(waypoint.id, 1)
    assert.equal(waypoint.title.en, 'Test Title')
    assert.equal(waypoint.slug, 'slug-for-test-title')
  })
  test('should throw error if latitude is invalid', async ({ assert }) => {
    const useCase = new CreateWaypointUseCase(
      mockWaypointRepository,
      mockTagRepository,
      mockSlugService
    )

    const invalidData = {
      latitude: 0, // Latitude invalide pour déclencher l'erreur
      longitude: 2.3522,
      title_en: 'Test Title',
      title_fr: 'Titre de test',
      description_en: 'Test Description',
      description_fr: 'Description de test',
      types: 'type',
      pmr: true,
    }

    await assert.rejects(() => useCase.handle(invalidData), 'Invalid latitude')
  })

  test('should throw error if title is missing', async ({ assert }) => {
    const useCase = new CreateWaypointUseCase(
      mockWaypointRepository,
      mockTagRepository,
      mockSlugService
    )

    const invalidData = {
      latitude: 48.8566,
      longitude: 2.3522,
      // Title missing to trigger validation error
      description_en: 'Test Description',
      description_fr: 'Description de test',
      types: 'type',
      pmr: true,
    }
    //@ts-ignore
    await assert.rejects(() => useCase.handle(invalidData), 'Title is required')
  })

  test('should throw error if waypoint type is invalid', async ({ assert }) => {
    const useCase = new CreateWaypointUseCase(
      mockWaypointRepository,
      mockTagRepository,
      mockSlugService
    )

    const invalidData = {
      latitude: 48.8566,
      longitude: 2.3522,
      title_en: 'Test Title',
      title_fr: 'Titre de test',
      description_en: 'Test Description',
      description_fr: 'Description de test',
      types: '', // Invalid type to trigger validation error
      pmr: true,
    }

    await assert.rejects(
      () => useCase.handle(invalidData),
      'InvalidTypesError: The waypoint type must be provided and cannot be empty.'
    )
  })
})

test.group('UpdateWaypointUseCase', () => {
  test('should update an existing waypoint', async ({ assert }) => {
    const useCase = new UpdateWaypointUseCase(mockWaypointRepository, mockSlugService)

    const id = 1

    const updateData = {
      latitude: 40.7128,
      longitude: -74.006,
      title_en: 'Updated Title',
      title_fr: 'Titre mis à jour',
    }

    const waypoint = await useCase.handle(id, updateData)

    assert.equal(waypoint.id, 1)
    assert.equal(waypoint.latitude, 40.7128)
    assert.equal(waypoint.title.en, 'Updated Title')
  })

  test('should throw error if waypoint not found', async ({ assert }) => {
    const useCase = new UpdateWaypointUseCase(mockWaypointRepository, mockSlugService)

    const id = 999 // ID invalide pour déclencher l'erreur

    const updateData = {
      latitude: 40.7128,
      longitude: -74.006,
      title_en: 'Updated Title',
      title_fr: 'Titre mis à jour',
    }

    await assert.rejects(() => useCase.handle(id, updateData), 'Waypoint not found')
  })
})

test.group('FindSlugWaypointUseCase', () => {
  test('should return a waypoint if it exists', async ({ assert }) => {
    const useCase = new FindSlugWaypointUseCase(mockWaypointRepository)

    const data = { slug: 'test-title' }
    const waypoint = await useCase.handle(data)

    assert.isNotNull(waypoint)
    assert.equal(waypoint?.slug, 'test-title')
    assert.equal(waypoint?.title.en, 'Test Title')
  })

  test('should return null if the waypoint is not found', async ({ assert }) => {
    const useCase = new FindSlugWaypointUseCase(mockWaypointRepository)

    const data = { slug: 'non-existent-title' }
    const waypoint = await useCase.handle(data)

    assert.isNull(waypoint)
  })

  test('should handle includes parameter properly', async ({ assert }) => {
    const useCase = new FindSlugWaypointUseCase(mockWaypointRepository)

    const data = { slug: 'test-title', includes: ['tags'] }
    const waypoint = await useCase.handle(data)

    assert.isNotNull(waypoint)
    assert.isArray(waypoint?.tags)
  })
})
test.group('WaypointTagsAssociateUseCase', () => {
  test('should successfully associate tags with a waypoint', async ({ assert }) => {
    const useCase = new WaypointTagsAssociateUseCase(mockWaypointRepository, mockTagRepository)

    const data = {
      id: 1,
      tags: [1, 2],
    }

    const waypoint = await useCase.handle(data)

    assert.isNotNull(waypoint)
    assert.isArray(waypoint.tags)
    assert.lengthOf(waypoint.tags!, 2)
    assert.equal(waypoint.tags![0].id, 1)
    assert.equal(waypoint.tags![1].id, 2)
  })

  test('should throw error if no tags are provided', async ({ assert }) => {
    const useCase = new WaypointTagsAssociateUseCase(mockWaypointRepository, mockTagRepository)

    const data = {
      id: 1, // Valid Waypoint ID
      tags: [], // No tags provided
    }

    await assert.rejects(
      () => useCase.handle(data),
      'NoAssocation : 0 tags were provided, provide more tags'
    )
  })

  test('should throw error if tags are not an array of numbers', async ({ assert }) => {
    const useCase = new WaypointTagsAssociateUseCase(mockWaypointRepository, mockTagRepository)

    const data = {
      id: 1, // Valid Waypoint ID
      tags: ['invalid-tag'], // Invalid tags
    }

    await assert.rejects(
      //@ts-ignore
      () => useCase.handle(data),
      'Invalid tag format: tags must be an array of numbers'
    )
  })

  test('should throw error if tag does not exist', async ({ assert }) => {
    const useCase = new WaypointTagsAssociateUseCase(mockWaypointRepository, mockTagRepository)

    const data = {
      id: 1, // Valid Waypoint ID
      tags: [999], // Non-existent Tag ID
    }

    await assert.rejects(() => useCase.handle(data), 'Tag with ID 999 does not exist')
  })

  test('should throw error if waypoint does not exist', async ({ assert }) => {
    const useCase = new WaypointTagsAssociateUseCase(mockWaypointRepository, mockTagRepository)

    const data = {
      id: 999, // Non-existent Waypoint ID
      tags: [1, 2], // Valid Tag IDs
    }

    await assert.rejects(() => useCase.handle(data), 'Waypoint with ID 999 does not exist')
  })
})
