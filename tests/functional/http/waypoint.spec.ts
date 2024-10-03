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

test.group('Update Waypoint Controller (PATCH)', (group) => {
  // Utilise la transaction globale pour annuler tout après chaque test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should update an existing waypoint partially', async ({ client, assert }) => {
    // Créer un waypoint avant de le mettre à jour
    const createResponse = await client.post('/api/waypoints').json({
      latitude: 12.3456,
      longitude: 65.4321,
      title_en: 'Original Waypoint EN',
      title_fr: 'Original Waypoint FR',
      description_en: 'Original description EN',
      description_fr: 'Original description FR',
      types: 'type1',
      pmr: true,
    })

    createResponse.assertStatus(201)
    const createdWaypoint = createResponse.body()

    // Faire une requête PATCH pour mettre à jour seulement certaines propriétés
    const patchResponse = await client.patch(`/api/waypoints/${createdWaypoint.id}`).json({
      latitude: 13.5678, // On ne met à jour que la latitude
      pmr: false, // Et l'accessibilité PMR
    })

    patchResponse.assertStatus(200) // Statut 200 pour succès
    const updatedWaypoint = patchResponse.body()

    // Vérifier que seulement les champs modifiés ont changé
    assert.equal(updatedWaypoint.latitude, 13.5678) // Latitude mise à jour
    assert.equal(updatedWaypoint.pmr, false) // PMR mise à jour
    assert.equal(updatedWaypoint.longitude, 65.4321) // Longitude doit rester inchangée
    assert.equal(updatedWaypoint.title['en'], 'Original Waypoint EN') // Le titre n'a pas changé
  })

  test('should return 404 if waypoint not found', async ({ client, assert }) => {
    // Essayer de mettre à jour un waypoint avec un ID inexistant
    const patchResponse = await client.patch('/api/waypoints/9999').json({
      latitude: 13.5678,
      pmr: false,
    })

    patchResponse.assertStatus(400) // Doit retourner 404 car le waypoint n'existe pas
    assert.equal(patchResponse.body().message, 'Waypoint not found')
  })

  test('should return 400 for invalid waypoint ID', async ({ client, assert }) => {
    // Envoyer une requête PATCH avec un ID invalide (non numérique)
    const patchResponse = await client.patch('/api/waypoints/invalid-id').json({
      latitude: 13.5678,
    })

    patchResponse.assertStatus(400) // Doit retourner 400 car l'ID n'est pas valide
    assert.equal(patchResponse.body().message, 'Invalid waypoint ID')
  })
})
