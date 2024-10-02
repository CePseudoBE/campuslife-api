import { test } from '@japa/runner'
import { Waypoint } from '#domain/entities/waypoint'

test.group('Waypoint Entity', () => {
  // Test du constructeur
  test('should create a waypoint with correct data', ({ assert }) => {
    const title = { en: 'Test Title', fr: 'Titre de test' }
    const description = { en: 'Test Description', fr: 'Description de test' }
    const waypoint = new Waypoint(
      1,
      48.8566,
      2.3522,
      title,
      'type',
      true,
      new Date(),
      new Date(),
      null,
      description,
      'test-slug'
    )

    assert.equal(waypoint.title.en, 'Test Title')
    assert.equal(waypoint.title.fr, 'Titre de test')
    assert.equal(waypoint.description?.en, 'Test Description')
    assert.equal(waypoint.slug, 'test-slug')
    assert.equal(waypoint.latitude, 48.8566)
    assert.equal(waypoint.longitude, 2.3522)
  })

  // Test de mise à jour
  test('should update waypoint data', ({ assert }) => {
    const title = { en: 'Old Title', fr: 'Ancien titre' }
    const waypoint = new Waypoint(
      1,
      48.8566,
      2.3522,
      title,
      'old-type',
      true,
      new Date(),
      new Date()
    )

    waypoint.update({
      latitude: 40.7128,
      longitude: -74.006,
      title_en: 'New Title',
      types: 'new-type',
    })

    assert.equal(waypoint.latitude, 40.7128)
    assert.equal(waypoint.longitude, -74.006)
    assert.equal(waypoint.title.en, 'New Title')
    assert.equal(waypoint.types, 'new-type')
  })

  // Test de suppression logique
  test('should mark waypoint as deleted', ({ assert }) => {
    const waypoint = new Waypoint(
      1,
      48.8566,
      2.3522,
      { en: 'Test', fr: 'test' },
      'type',
      true,
      new Date(),
      new Date()
    )

    waypoint.delete()
    assert.isNotNull(waypoint.deletedAt)
  })

  // Test de mise à jour des titres multilingues
  test('should update title in both languages', ({ assert }) => {
    const waypoint = new Waypoint(
      1,
      48.8566,
      2.3522,
      { en: 'Old English Title', fr: 'Ancien titre français' },
      'type',
      true,
      new Date(),
      new Date()
    )

    waypoint.update({ title_en: 'New English Title', title_fr: 'Nouveau titre français' })

    assert.equal(waypoint.title.en, 'New English Title')
    assert.equal(waypoint.title.fr, 'Nouveau titre français')
  })

  // Test de mise à jour des descriptions multilingues
  test('should update description in both languages', ({ assert }) => {
    const waypoint = new Waypoint(
      1,
      48.8566,
      2.3522,
      { en: 'Title', fr: 'test' },
      'type',
      true,
      new Date(),
      new Date(),
      null,
      { en: 'Old English Description', fr: 'Ancienne description française' }
    )

    waypoint.update({
      description_en: 'New English Description',
      description_fr: 'Nouvelle description française',
    })

    assert.equal(waypoint.description?.en, 'New English Description')
    assert.equal(waypoint.description?.fr, 'Nouvelle description française')
  })

  // Test de validation de la latitude
  test('should throw error if latitude is out of bounds', ({ assert }) => {
    assert.throws(() => {
      new Waypoint(
        1,
        100,
        2.3522,
        { en: 'Title', fr: 'test' },
        'type',
        true,
        new Date(),
        new Date()
      )
    }, 'Latitude must be between -90 and 90')
  })

  // Test de validation de la longitude
  test('should throw error if longitude is out of bounds', ({ assert }) => {
    assert.throws(() => {
      new Waypoint(
        1,
        48.8566,
        200,
        { en: 'Title', fr: 'test' },
        'type',
        true,
        new Date(),
        new Date()
      )
    }, 'Longitude must be between -180 and 180')
  })
})
