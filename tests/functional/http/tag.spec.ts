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
