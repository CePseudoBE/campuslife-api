import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import CollectionModel from '#infrastructure/orm/models/collection_model'

// Test group for the CreateTagController
test.group('CreateTagController', (group) => {
  // Use a global transaction to rollback any changes after each test
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a new tag successfully', async ({ client, assert }) => {
    // Mock payload
    const payload = {
      title_en: 'Test Tag EN',
      title_fr: 'Test Tag FR',
      collections: [],
    }

    // Simulate the request to the CreateTagController
    const response = await client.post('/api/tags').json(payload)

    // Check that the response status is 201 Created
    response.assertStatus(201)

    // Check that the tag has been created successfully
    const tag = response.body().data
    assert.exists(tag)
    assert.equal(tag.title.en, 'Test Tag EN')
    assert.equal(tag.title.fr, 'Test Tag FR')
    assert.isUndefined(tag.collections) // No collections associated
  })

  test('should fail validation if title_en is too short', async ({ client, assert }) => {
    // Mock invalid payload
    const invalidPayload = {
      title_en: 'Te', // Too short
      title_fr: 'Test Tag FR',
      collections: [],
    }

    // Simulate the request to the CreateTagController
    const response = await client.post('/api/tags').json(invalidPayload)

    // Check that the response status is 400 Bad Request due to validation failure
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
    // Mock invalid payload with missing title_fr
    const invalidPayload = {
      title_en: 'Test Tag EN',
      collections: [],
    }

    // Simulate the request to the CreateTagController
    const response = await client.post('/api/tags').json(invalidPayload)

    // Check that the response status is 400 Bad Request due to missing field
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
    // Mock invalid payload with wrong collections format
    const invalidPayload = {
      title_en: 'Test Tag EN',
      title_fr: 'Test Tag FR',
      collections: ['invalid-collection'], // Invalid collection format
    }

    // Simulate the request to the CreateTagController
    const response = await client.post('/api/tags').json(invalidPayload)

    // Check that the response status is 400 Bad Request due to invalid collections
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
    // Mock valid collections
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

    // Mock payload
    const payload = {
      title_en: 'Test Tag EN',
      title_fr: 'Test Tag FR',
      collections: [collection1.id, collection2.id],
    }

    // Simulate the request to the CreateTagController
    const response = await client.post('/api/tags').json(payload)
    // Check that the response status is 201 Created
    response.assertStatus(201)

    // Check that the tag has been created successfully
    const tag = response.body().data
    assert.exists(tag)
    assert.equal(tag.title.en, 'Test Tag EN')
    assert.equal(tag.title.fr, 'Test Tag FR')
    assert.lengthOf(tag.collections, 2)
  })
})
