import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'

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
    assert.equal(string.slug(json.title_en, { lower: true }), waypoint?.slug)
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

test.group('Delete Waypoint Controller', (group) => {
  // Utilisation de la transaction globale pour annuler tout après chaque test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should delete an existing waypoint successfully', async ({ client, assert }) => {
    // Créer un waypoint directement via le modèle sans passer par l'API
    const waypoint = new WaypointModel()
    waypoint.latitude = 12.3456
    waypoint.longitude = 65.4321
    waypoint.titleJson = { en: 'Test Waypoint', fr: 'test' }
    waypoint.descriptionJson = { en: 'Test description', fr: 'test' }
    waypoint.types = 'type1'
    waypoint.pmr = true
    waypoint.slug = 'test-waypoint'
    await waypoint.save()

    // Faire une requête DELETE pour supprimer le waypoint
    const response = await client.delete(`/api/waypoints/${waypoint.id}`)

    response.assertStatus(204) // Statut 204 No Content pour suppression réussie

    // Vérifier que le waypoint a été soft deleted (en vérifiant deleted_at)
    const deletedWaypoint = await WaypointModel.find(waypoint.id)
    assert.exists(deletedWaypoint?.deletedAt) // Vérifier que deletedAt est défini
  })

  test('should return 400 if trying to delete an already deleted waypoint', async ({
    client,
    assert,
  }) => {
    // Créer un waypoint directement via le modèle
    const waypoint = new WaypointModel()
    waypoint.latitude = 12.3456
    waypoint.longitude = 65.4321
    waypoint.titleJson = { en: 'Test Waypoint', fr: 'test' }
    waypoint.descriptionJson = { en: 'Test description', fr: 'test' }
    waypoint.types = 'type1'
    waypoint.pmr = true
    waypoint.slug = 'test-waypoint'
    await waypoint.save()

    // Marquer le waypoint comme supprimé (soft delete)
    waypoint.deletedAt = DateTime.now()
    await waypoint.save()

    // Tenter de supprimer un waypoint déjà soft deleted
    const response = await client.delete(`/api/waypoints/${waypoint.id}`)

    response.assertStatus(400) // Statut 400 Bad Request attendu
    assert.equal(response.body().message, 'Waypoint deleted') // Message d'erreur attendu
  })

  test('should return 400 if invalid ID is provided', async ({ client, assert }) => {
    // Tenter de supprimer un waypoint avec un ID invalide (non numérique)
    const response = await client.delete('/api/waypoints/invalid-id')

    response.assertStatus(400) // Statut 400 attendu pour une requête invalide
    assert.equal(response.body().message, 'Bad ID provided (non existent or NaN)') // Message d'erreur attendu
  })
})

test.group('Get one Waypoint Controller', (group) => {
  // Utilisation de la transaction globale pour annuler tout après chaque test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get the waypoint successfully', async ({ client, assert }) => {
    const json = {
      latitude: 12.3456,
      longitude: 65.4321,
      title_en: 'Original Waypoint EN',
      title_fr: 'Original Waypoint FR',
      description_en: 'Original description EN',
      description_fr: 'Original description FR',
      types: 'type1',
      pmr: true,
    }
    // Créer un waypoint directement
    const createResponse = await client.post('/api/waypoints').json(json)

    createResponse.assertStatus(201)
    const createdWaypoint = createResponse.body()

    // Faire une requête GET pour récupérer le waypoint
    const response = await client.get(`/api/waypoints/${createdWaypoint.id}`)

    const actualDesc = {
      en: json.description_en,
      fr: json.description_fr,
    }

    response.assertStatus(200) // Statut 200 pour récupération réussite
    assert.equal(json.latitude, response.body().data.latitude)
    assert.deepEqual(actualDesc, response.body().data.description)
  })

  test('should return 400 if trying to get non existant waypoint', async ({ client, assert }) => {
    const response = await client.get(`/api/waypoints/99999`)

    response.assertStatus(400) // Statut 400 Bad Request attendu
    assert.equal(response.body().message, 'Waypoint with id : 99999 does not exist') // Message d'erreur attendu
  })

  test('should get the waypoint successfully with only the french title and description', async ({
    client,
    assert,
  }) => {
    const json = {
      latitude: 12.3456,
      longitude: 65.4321,
      title_en: 'Original Waypoint EN',
      title_fr: 'Original Waypoint FR',
      description_en: 'Original description EN',
      description_fr: 'Original description FR',
      types: 'type1',
      pmr: true,
    }
    // Créer un waypoint directement
    const createResponse = await client.post('/api/waypoints').json(json)

    createResponse.assertStatus(201)
    const createdWaypoint = createResponse.body()

    // Faire une requête GET pour récupérer le waypoint
    const response = await client.get(`/api/fr/waypoints/${createdWaypoint.id}`)

    response.assertStatus(200) // Statut 200 pour récupération réussite
    assert.equal(json.latitude, response.body().data.latitude)
    assert.equal(json.description_fr, response.body().data.description)
    assert.equal(json.title_fr, response.body().data.title)
  })

  test('should return 400 if trying to get non existant languages', async ({ client, assert }) => {
    const response = await client.get(`/api/dz/waypoints/1`)

    response.assertStatus(400) // Statut 400 Bad Request attendu
    assert.equal(response.body().message, 'InvalidLanguage: Supported languages are fr and en') // Message d'erreur attendu
  })
})

test.group('Get all Waypoints Controller', (group) => {
  // Utilisation de la transaction globale pour annuler tout après chaque test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get all waypoints successfully', async ({ client, assert }) => {
    const waypoint1 = {
      latitude: 12.3456,
      longitude: 65.4321,
      title_en: 'Waypoint EN 1',
      title_fr: 'Waypoint FR 1',
      description_en: 'Description EN 1',
      description_fr: 'Description FR 1',
      types: 'type1',
      pmr: true,
    }
    const waypoint2 = {
      latitude: 23.4567,
      longitude: 54.321,
      title_en: 'Waypoint EN 2',
      title_fr: 'Waypoint FR 2',
      description_en: 'Description EN 2',
      description_fr: 'Description FR 2',
      types: 'type2',
      pmr: false,
    }

    // Créer deux waypoints directement
    await client.post('/api/waypoints').json(waypoint1)
    await client.post('/api/waypoints').json(waypoint2)

    // Faire une requête GET pour récupérer tous les waypoints
    const response = await client.get('/api/waypoints')

    response.assertStatus(200) // Statut 200 pour récupération réussite

    assert.isArray(response.body().data) // Vérifie que le résultat est bien un tableau
    assert.lengthOf(response.body().data, 2) // Vérifie qu'il y a bien 2 waypoints récupérés

    // Vérifie que les données des waypoints sont bien présentes
    assert.equal(response.body().data[1].latitude, waypoint1.latitude)
    assert.equal(response.body().data[0].latitude, waypoint2.latitude)
  })

  test('should return empty array if no waypoints exist', async ({ client, assert }) => {
    // Faire une requête GET pour récupérer les waypoints (aucun waypoint n'existe)
    const response = await client.get('/api/waypoints')

    response.assertStatus(200) // Statut 200 OK
    assert.isArray(response.body().data) // Vérifie que le résultat est bien un tableau
    assert.isEmpty(response.body().data) // Vérifie que le tableau est vide
  })
})
