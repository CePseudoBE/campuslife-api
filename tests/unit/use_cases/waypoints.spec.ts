import { test } from '@japa/runner'
import { Waypoint } from '#domain/entities/waypoint'
import { ISlugService } from '#domain/services/islug_service'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { CreateWaypointUseCase } from '#domain/use_cases/waypoints/create_waypoint_use_case'
import { UpdateWaypointUseCase } from '#domain/use_cases/waypoints/update_waypoint_use_case'

const mockWaypointRepository: IWaypointRepository = {
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
}

const mockSlugService: ISlugService = {
  generate: (title: string) => `slug-for-${title.toLowerCase().replace(/ /g, '-')}`,
}

test.group('CreateWaypointUseCase', () => {
  test('should create a new waypoint with a slug using the use case', async ({ assert }) => {
    const useCase = new CreateWaypointUseCase(mockWaypointRepository, mockSlugService)

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
    const useCase = new CreateWaypointUseCase(mockWaypointRepository, mockSlugService)

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
})

test.group('UpdateWaypointUseCase', () => {
  test('should update an existing waypoint', async ({ assert }) => {
    const useCase = new UpdateWaypointUseCase(mockWaypointRepository)

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
    const useCase = new UpdateWaypointUseCase(mockWaypointRepository)

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
