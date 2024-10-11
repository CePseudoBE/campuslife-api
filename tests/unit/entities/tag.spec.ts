import { test } from '@japa/runner'
import { Tag } from '#domain/entities/tag'

test.group('Tag Entity', () => {
  // Test du constructeur
  test('should create a tag with correct data', ({ assert }) => {
    const title = { en: 'Test Tag', fr: 'Étiquette de test' }
    const tag = new Tag(1, title, new Date(), new Date(), null, [], [], [])

    assert.equal(tag.title.en, 'Test Tag')
    assert.equal(tag.title.fr, 'Étiquette de test')
    assert.equal(tag.waypoints?.length, 0)
    assert.equal(tag.events?.length, 0)
    assert.equal(tag.collections?.length, 0)
  })

  // Test de mise à jour
  test('should update tag data', ({ assert }) => {
    const title = { en: 'Old Tag', fr: 'Ancienne étiquette' }
    const tag = new Tag(1, title, new Date(), new Date())

    tag.update({
      title_en: 'New Tag',
    })

    assert.equal(tag.title.en, 'New Tag')
  })

  // Test de suppression logique
  test('should mark tag as deleted', ({ assert }) => {
    const tag = new Tag(1, { en: 'Test Tag', fr: 'Étiquette de test' }, new Date(), new Date())

    tag.delete()
    assert.isNotNull(tag.deletedAt)
  })

  // Test de mise à jour des titres multilingues
  test('should update title in both languages', ({ assert }) => {
    const tag = new Tag(
      1,
      { en: 'Old English Tag', fr: 'Ancienne étiquette française' },
      new Date(),
      new Date()
    )

    tag.update({ title_en: 'New English Tag', title_fr: 'Nouvelle étiquette française' })

    assert.equal(tag.title.en, 'New English Tag')
    assert.equal(tag.title.fr, 'Nouvelle étiquette française')
  })

  // Test de validation du titre anglais
  test('should throw error if English title is missing or empty', ({ assert }) => {
    assert.throws(() => {
      new Tag(
        1,
        { en: '', fr: 'Étiquette française' }, // Titre anglais vide
        new Date(),
        new Date()
      )
    }, 'InvalidTitleError: The English title must be provided and cannot be empty.')

    assert.throws(() => {
      new Tag(
        1,
        // @ts-ignore
        { fr: 'Étiquette française' }, // Titre anglais manquant
        new Date(),
        new Date()
      )
    }, 'InvalidTitleError: The English title must be provided and cannot be empty.')
  })

  // Test de validation du titre français
  test('should throw error if French title is missing or empty', ({ assert }) => {
    assert.throws(() => {
      new Tag(
        1,
        { en: 'English Tag', fr: '' }, // Titre français vide
        new Date(),
        new Date()
      )
    }, 'InvalidTitleError: The French title must be provided and cannot be empty.')

    assert.throws(() => {
      new Tag(
        1,
        // @ts-ignore
        { en: 'English Tag' }, // Titre français manquant
        new Date(),
        new Date()
      )
    }, 'InvalidTitleError: The French title must be provided and cannot be empty.')
  })
})
