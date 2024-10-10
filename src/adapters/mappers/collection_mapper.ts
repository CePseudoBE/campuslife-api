import CollectionModel from '#infrastructure/orm/models/collection_model'
import { Collection } from '#domain/entities/collection'
import { TagMapper } from '#adapters/mappers/tag_mapper'
import { DateTime } from 'luxon'

export class CollectionMapper {
  static toPersistence(collection: Collection): CollectionModel {
    const collectionModel = new CollectionModel()
    collectionModel.name = collection.name
    collectionModel.heroicons = collection.heroicons
    collectionModel.deletedAt = collection.deletedAt
      ? DateTime.fromJSDate(collection.deletedAt)
      : null
    return collectionModel
  }

  static toDomain(collectionModel: CollectionModel): Collection {
    const collection = new Collection(
      collectionModel.id,
      collectionModel.name,
      collectionModel.heroicons,
      collectionModel.createdAt.toJSDate(),
      collectionModel.updatedAt.toJSDate(),
      collectionModel.deletedAt ? collectionModel.deletedAt.toJSDate() : null
    )

    if (collectionModel.tags) {
      collection.tags = collectionModel.tags.map((tagModel) => TagMapper.toDomain(tagModel))
    }

    return collection
  }
}
