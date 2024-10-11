import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import CollectionModel from '#infrastructure/orm/models/collection_model'
import TagModel from '#infrastructure/orm/models/tag_model'
import { DateTime } from 'luxon'

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

test.group('DeleteTagController', (group) => {
  // Use global transaction for each test to rollback changes
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should delete an existing tag successfully', async ({ client, assert }) => {
    // Create a tag directly via the model
    const tag = new TagModel()
    tag.title = { en: 'Test Tag EN', fr: 'Test Tag FR' }
    await tag.save()

    // Make a DELETE request to delete the tag
    const response = await client.delete(`/api/tags/${tag.id}`)

    // Expect 204 No Content response
    response.assertStatus(204)

    // Check if the tag was soft deleted
    const deletedTag = await TagModel.find(tag.id)
    assert.exists(deletedTag?.deletedAt) // Ensure deletedAt field is set
  })

  test('should return 400 if tag does not exist', async ({ client, assert }) => {
    // Try to delete a tag with a non-existent ID
    const response = await client.delete('/api/tags/9999')

    // Expect 400 Bad Request response with a specific error message
    response.assertStatus(400)
    assert.equal(response.body().message, 'NotFound: Tag not found')
  })

  test('should return 400 for invalid tag ID', async ({ client, assert }) => {
    // Try to delete a tag with an invalid (non-numeric) ID
    const response = await client.delete('/api/tags/invalid-id')

    // Expect 400 Bad Request response with a specific error message
    response.assertStatus(400)
    assert.equal(response.body().message, 'Bad ID provided (non existent or NaN)')
  })

  test('should return 400 if tag is already deleted', async ({ client, assert }) => {
    // Create a tag and mark it as deleted
    const tag = new TagModel()
    tag.title = { en: 'Test Tag EN', fr: 'Test Tag FR' }
    tag.deletedAt = DateTime.now() // Soft delete the tag
    await tag.save()

    // Try to delete the already deleted tag
    const response = await client.delete(`/api/tags/${tag.id}`)

    // Expect 400 Bad Request response with a specific error message
    response.assertStatus(400)
    assert.equal(response.body().message, 'AlreadyDelete: Tag deleted')
  })
})
