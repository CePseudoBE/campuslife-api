import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import string from '@adonisjs/core/helpers/string'

test.group('Create Waypoint Controller', (group) => {
  // Utiliser une transaction globale pour annuler tout après chaque test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a new waypoint successfully', async ({ client, assert }) => {
    const json = {
      latitude: 12.3456,
      longitude: 65.4321,
      title_en: 'Test Waypoint EN',
      title_fr: 'Test Waypoint FR',
      description_en: 'Test description EN',
      description_fr: 'Test description FR',
      types: 'test',
      pmr: true,
    }
    const response = await client.post('/api/waypoints').json(json)

    response.assertStatus(201)
    assert.exists(response.body().id)

    const waypoint = await WaypointModel.find(response.body().id)
    assert.exists(waypoint)
    assert.equal(string.slug(json.title_en), waypoint?.slug)
  })

  test('should fail when validation fails', async ({ client, assert }) => {
    const response = await client.post('/api/waypoints').json({
      latitude: null, // Latitude is required and cannot be null
      longitude: 65.4321,
      title_en: 'Test Waypoint EN',
      // Missing required fields like title_fr
      description_en: 'Test description EN',
      description_fr: 'Test description FR',
      types: ['type1'],
      pmr: false,
      slug: 'invalid-slug',
    })

    response.assertStatus(400) // 400 Bad Request due to validation errors
    assert.equal(response.body().message, 'Validation failure')
    assert.isArray(response.body().details)
  })
})
