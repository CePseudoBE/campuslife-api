import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import CollectionModel from '#infrastructure/orm/models/collection_model'
import TagModel from '#infrastructure/orm/models/tag_model'
import { DateTime } from 'luxon'

// Test group for the CreateTagController
test.group('CreateTagController', (group) => {
  // Use a global transaction to roll back any changes after each test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a new tag successfully', async ({ client, assert }) => {
    const payload = {
      title_en: 'Test Tag EN',
      title_fr: 'Test Tag FR',
      collections: [],
    }

    const response = await client.post('/api/tags').json(payload)

    response.assertStatus(201)

    const tag = response.body().data
    assert.exists(tag)
    assert.equal(tag.title.en, 'Test Tag EN')
    assert.equal(tag.title.fr, 'Test Tag FR')
    assert.isUndefined(tag.collections)
  })

  test('should fail validation if title_en is too short', async ({ client, assert }) => {
    const invalidPayload = {
      title_en: 'Te', // Too short
      title_fr: 'Test Tag FR',
      collections: [],
    }

    const response = await client.post('/api/tags').json(invalidPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
    assert.isArray(response.body().details)
    assert.deepInclude(response.body().details[0], {
      message: 'The title_en field must have at least 3 characters',
      rule: 'minLength',
      field: 'title_en',
      meta: { min: 3 },
    })
  })

  test('should fail if title_fr is not provided', async ({ client, assert }) => {
    const invalidPayload = {
      title_en: 'Test Tag EN',
      collections: [],
    }

    const response = await client.post('/api/tags').json(invalidPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
    assert.isArray(response.body().details)
    assert.deepInclude(response.body().details[0], {
      message: 'The title_fr field must be defined',
      rule: 'required',
      field: 'title_fr',
    })
  })

  test('should fail if collections are not an array of numbers', async ({ client, assert }) => {
    const invalidPayload = {
      title_en: 'Test Tag EN',
      title_fr: 'Test Tag FR',
      collections: ['invalid-collection'],
    }

    const response = await client.post('/api/tags').json(invalidPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
    assert.isArray(response.body().details)
    assert.deepInclude(response.body().details[0], {
      message: 'The 0 field must be a number',
      rule: 'number',
      field: 'collections.0',
      index: 0,
    })
  })

  test('should create a new tag with valid collections successfully', async ({
    client,
    assert,
  }) => {
    const collection1 = await CollectionModel.create({
      name: {
        fr: 'collection1fr',
        en: 'collection1en',
      },
      heroicons: 'test',
    })

    const collection2 = await CollectionModel.create({
      name: {
        fr: 'collection2fr',
        en: 'collection2en',
      },
      heroicons: 'test',
    })

    const payload = {
      title_en: 'Test Tag EN',
      title_fr: 'Test Tag FR',
      collections: [collection1.id, collection2.id],
    }

    const response = await client.post('/api/tags').json(payload)
    response.assertStatus(201)

    const tag = response.body().data
    assert.exists(tag)
    assert.equal(tag.title.en, 'Test Tag EN')
    assert.equal(tag.title.fr, 'Test Tag FR')
    assert.lengthOf(tag.collections, 2)
  })
})

test.group('DeleteTagController', (group) => {
  // Use global transaction for each test to rollback changes
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should delete an existing tag successfully', async ({ client, assert }) => {
    const tag = new TagModel()
    tag.title = { en: 'Test Tag EN', fr: 'Test Tag FR' }
    await tag.save()

    const response = await client.delete(`/api/tags/${tag.id}`)

    response.assertStatus(204)

    const deletedTag = await TagModel.find(tag.id)
    assert.exists(deletedTag?.deletedAt)
  })

  test('should return 400 if tag does not exist', async ({ client, assert }) => {
    const response = await client.delete('/api/tags/9999')

    response.assertStatus(400)
    assert.equal(response.body().message, 'NotFound: Tag not found')
  })

  test('should return 400 for invalid tag ID', async ({ client, assert }) => {
    const response = await client.delete('/api/tags/invalid-id')

    response.assertStatus(400)
    assert.equal(response.body().message, 'Bad ID provided (non existent or NaN)')
  })

  test('should return 400 if tag is already deleted', async ({ client, assert }) => {
    const tag = new TagModel()
    tag.title = { en: 'Test Tag EN', fr: 'Test Tag FR' }
    tag.deletedAt = DateTime.now()
    await tag.save()

    const response = await client.delete(`/api/tags/${tag.id}`)

    response.assertStatus(400)
    assert.equal(response.body().message, 'AlreadyDelete: Tag deleted')
  })
})

test.group('UpdateTagController', (group) => {
  // Use global transaction for each test to rollback changes
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should update an existing tag partially (PATCH behavior)', async ({ client, assert }) => {
    const tag = new TagModel()
    tag.title = { en: 'Original Tag EN', fr: 'Original Tag FR' }
    await tag.save()

    const payload = {
      title_en: 'Updated Tag EN',
    }

    const response = await client.patch(`/api/tags/${tag.id}`).json(payload)

    response.assertStatus(200)

    const updatedTag = response.body().data
    assert.equal(updatedTag.title.en, 'Updated Tag EN')
    assert.equal(updatedTag.title.fr, 'Original Tag FR')
  })

  test('should fail if invalid tag ID is provided', async ({ client, assert }) => {
    const response = await client.patch('/api/tags/invalid-id').json({
      title_en: 'New Tag EN',
    })

    response.assertStatus(400)
    assert.equal(response.body().message, 'Invalid tag ID')
  })

  test('should return 404 if tag does not exist', async ({ client, assert }) => {
    const response = await client.patch('/api/tags/9999').json({
      title_en: 'Updated Tag EN',
    })

    response.assertStatus(400)
    assert.equal(response.body().message, 'NotFound: Tag not found')
  })

  test('should return validation error if title_en is too short', async ({ client, assert }) => {
    const tag = new TagModel()
    tag.title = { en: 'Original Tag EN', fr: 'Original Tag FR' }
    await tag.save()

    const payload = {
      title_en: 'Up',
    }

    const response = await client.patch(`/api/tags/${tag.id}`).json(payload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
    assert.isArray(response.body().details)
    assert.deepInclude(response.body().details[0], {
      message: 'The title_en field must have at least 3 characters',
      rule: 'minLength',
      field: 'title_en',
      meta: { min: 3 },
    })
  })

  test('should handle partial updates without errors when no fields are provided', async ({
    client,
    assert,
  }) => {
    const tag = new TagModel()
    tag.title = { en: 'Original Tag EN', fr: 'Original Tag FR' }
    await tag.save()

    const response = await client.patch(`/api/tags/${tag.id}`).json({})

    response.assertStatus(200)

    const updatedTag = response.body().data
    assert.equal(updatedTag.title.en, 'Original Tag EN')
    assert.equal(updatedTag.title.fr, 'Original Tag FR')
  })
})

test.group('FindTagByIdController', (group) => {
  // Use a global transaction to roll back any changes after each test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return a tag by ID successfully', async ({ client, assert }) => {
    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })
    const response = await client.get(`/api/tags/${tag.id}`)

    response.assertStatus(200)

    const responseData = response.body().data
    assert.exists(responseData)
    assert.equal(responseData.title.en, 'Test Tag EN')
    assert.equal(responseData.title.fr, 'Test Tag FR')
  })

  test('should return 400 if invalid ID is provided', async ({ client, assert }) => {
    const response = await client.get('/api/tags/invalid-id')

    response.assertStatus(400)
    assert.equal(response.body().message, 'Bad ID provided (non existent or NaN)')
  })

  test('should return 400 if tag does not exist', async ({ client, assert }) => {
    const response = await client.get('/api/tags/9999')

    response.assertStatus(400)
    assert.equal(response.body().message, 'NotFound: Tag not found')
  })

  test('should return a tag with collections included', async ({ client, assert }) => {
    const collection1 = await CollectionModel.create({
      name: { fr: 'collection1fr', en: 'collection1en' },
      heroicons: 'test',
    })
    const collection2 = await CollectionModel.create({
      name: { fr: 'collection2fr', en: 'collection2en' },
      heroicons: 'test',
    })

    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })

    await tag.related('collections').sync([collection1.id, collection2.id])

    const response = await client.get(`/api/tags/${tag.id}?include=collections`)

    response.assertStatus(200)

    const responseData = response.body().data
    assert.exists(responseData)
    assert.equal(responseData.title.en, 'Test Tag EN')
    assert.equal(responseData.title.fr, 'Test Tag FR')
    assert.exists(responseData.collections)
    assert.lengthOf(responseData.collections, 2)
  })

  test('should handle multilingual data and return tag in the requested language', async ({
    client,
    assert,
  }) => {
    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })

    const response = await client.get(`/api/fr/tags/${tag.id}`)

    response.assertStatus(200)

    const responseData = response.body().data
    assert.exists(responseData)
    assert.equal(responseData.title, 'Test Tag FR')
  })

  test('should return 400 if an unsupported language is requested', async ({ client, assert }) => {
    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })

    const response = await client.get(`/api/dz/tags/${tag.id}`)

    response.assertStatus(400)
    assert.equal(response.body().message, 'InvalidLanguage: Supported languages are fr and en')
  })
})

test.group('FindWaypointsController', (group) => {
  // Use a global transaction to rollback any changes after each test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return a list of tags', async ({ client, assert }) => {
    await TagModel.create({
      title: { en: 'Tag 1 EN', fr: 'Tag 1 FR' },
    })

    await TagModel.create({
      title: { en: 'Tag 2 EN', fr: 'Tag 2 FR' },
    })

    const response = await client.get('/api/tags')

    response.assertStatus(200)
    const responseData = response.body().data
    assert.isArray(responseData)
    assert.lengthOf(responseData, 2)
  })

  test('should filter out deleted tags when deleted=false', async ({ client, assert }) => {
    await TagModel.create({
      title: { en: 'Tag 1 EN', fr: 'Tag 1 FR' },
      deletedAt: DateTime.now(),
    })

    await TagModel.create({
      title: { en: 'Tag 2 EN', fr: 'Tag 2 FR' },
    })

    const response = await client.get('/api/tags?deleted=false')

    response.assertStatus(200)
    const responseData = response.body().data
    assert.isArray(responseData)
    assert.lengthOf(responseData, 1)
    assert.equal(responseData[0].title.en, 'Tag 2 EN')
  })

  test('should return all tags including deleted when deleted=true', async ({ client, assert }) => {
    await TagModel.create({
      title: { en: 'Tag 1 EN', fr: 'Tag 1 FR' },
      deletedAt: DateTime.now(),
    })

    await TagModel.create({
      title: { en: 'Tag 2 EN', fr: 'Tag 2 FR' },
    })

    const response = await client.get('/api/tags?deleted=true')

    response.assertStatus(200)
    const responseData = response.body().data
    assert.isArray(responseData)
    assert.lengthOf(responseData, 2)
    assert.equal(responseData[1].title.en, 'Tag 1 EN')
  })

  test('should return 400 for invalid deleted parameter', async ({ client, assert }) => {
    const response = await client.get('/api/tags?deleted=invalid')

    response.assertStatus(400)
    assert.equal(response.body().message, 'BadType: deleted needs to be true or false')
  })
})

test.group('AssociateTagController', (group) => {
  // Utilisation de la transaction globale pour annuler tout après chaque test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should associate valid collections with an existing tag', async ({ client, assert }) => {
    // Créer un tag
    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })

    // Créer deux collections valides
    const collection1 = await CollectionModel.create({
      name: { en: 'Collection EN 1', fr: 'Collection FR 1' },
      heroicons: 'test',
    })

    const collection2 = await CollectionModel.create({
      name: { en: 'Collection EN 2', fr: 'Collection FR 2' },
      heroicons: 'test',
    })

    const collectionsPayload = {
      collections: [collection1.id, collection2.id],
    }

    // Associer les collections au tag
    const response = await client.post(`/api/tags/${tag.id}/collections`).json(collectionsPayload)

    response.assertStatus(201)
    assert.exists(response.body().data)

    const associatedTag = await TagModel.query().preload('collections').where('id', tag.id).first()

    assert.exists(associatedTag)
    assert.equal(associatedTag?.collections.length, 2)
  })

  test('should return error when trying to associate non-existing collections', async ({
    client,
    assert,
  }) => {
    // Créer un tag
    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })

    const collectionsPayload = {
      collections: [9999, 8888], // Collections qui n'existent pas
    }

    // Essayer d'associer les collections inexistantes au tag
    const response = await client.post(`/api/tags/${tag.id}/collections`).json(collectionsPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'NotFound: Collection not found')
  })

  test('should return error if invalid ID is provided', async ({ client, assert }) => {
    const collectionsPayload = {
      collections: [1, 2],
    }

    // Essayer de faire une requête avec un ID de tag invalide (non numérique)
    const response = await client.post(`/api/tags/invalid-id/collections`).json(collectionsPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Bad ID provided (non existent or NaN)')
  })

  test('should return validation error if collections are not an array of numbers', async ({
    client,
    assert,
  }) => {
    // Créer un tag
    const tag = await TagModel.create({
      title: { en: 'Test Tag EN', fr: 'Test Tag FR' },
    })

    const invalidCollectionsPayload = {
      collections: ['invalid-collection'],
    }

    const response = await client
      .post(`/api/tags/${tag.id}/collections`)
      .json(invalidCollectionsPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
    assert.isArray(response.body().details)
    assert.deepInclude(response.body().details[0], {
      message: 'The 0 field must be a number',
      rule: 'number',
      field: 0,
      index: 0,
    })
  })

  test('should return error if tag does not exist', async ({ client, assert }) => {
    const collectionsPayload = {
      collections: [1, 2], // Collections valides
    }

    // Essayer d'associer des collections à un tag qui n'existe pas
    const response = await client.post(`/api/tags/9999/collections`).json(collectionsPayload)

    response.assertStatus(400)
    assert.equal(response.body().message, 'NotFound: Collection not found')
  })
})
