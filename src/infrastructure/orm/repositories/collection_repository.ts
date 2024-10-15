import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { inject } from '@adonisjs/core'
import { Collection } from '#domain/entities/collection'
import { QueryParams } from '#domain/services/sorting_validation'
import { CollectionMapper } from '#adapters/mappers/collection_mapper'
import CollectionModel from '#infrastructure/orm/models/collection_model'
import { DateTime } from 'luxon'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

@inject()
export class CollectionRepository extends ICollectionRepository {
  constructor() {
    super()
  }

  async create(collection: Collection): Promise<Collection> {
    const collectionModel = CollectionMapper.toPersistence(collection)
    await collectionModel.save()
    return CollectionMapper.toDomain(collectionModel)
  }

  async delete(collection: Collection): Promise<null> {
    if (!collection.id) {
      throw new Error('NotFound: Collection not found')
    }

    const collectionModel = await CollectionModel.query()
      .whereNull('deleted_at')
      .andWhere('id', collection.id)
      .first()

    if (!collectionModel) {
      throw new Error('AlreadyDelete: Collection deleted')
    }

    collectionModel.deletedAt = DateTime.fromJSDate(collection.deletedAt!)

    await collectionModel.save()
    return null
  }

  async findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Collection[]> {
    const query = CollectionModel.query()

    if (!deleted) {
      query.whereNull('deleted_at')
    }

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    if (includes && includes.length > 0) {
      query.preload(includes[0] as ExtractModelRelations<CollectionModel>)
      for (let i = 1; i < includes.length; i++) {
        query.preload(includes[i] as ExtractModelRelations<CollectionModel>)
      }
    }

    const collectionModels = await query.exec()

    return collectionModels.map((collection) => CollectionMapper.toDomain(collection))
  }

  async findById(id: number, connected: boolean, includes?: string[]): Promise<Collection> {
    const collectionModel = await CollectionModel.find(id)
    if (!collectionModel) {
      throw new Error('NotFound: Collection not found')
    }

    if (!connected) {
      if (collectionModel.deletedAt) throw new Error('AlreadyDelete: Tag deleted')
    }

    if (includes && includes.length > 0) {
      for (const relation of includes) {
        await collectionModel.load(relation as ExtractModelRelations<CollectionModel>)
      }
    }

    return CollectionMapper.toDomain(collectionModel)
  }

  async update(collection: Collection): Promise<Collection> {
    if (!collection.id) {
      throw new Error(`NotFound: Collection not found`)
    }

    const collectionModel = await CollectionModel.query()
      .whereNull('deleted_at')
      .andWhere('id', collection.id)
      .first()

    if (!collectionModel) {
      throw new Error('Deleted: Collection deleted')
    }

    collectionModel.name = collection.name
    collectionModel.heroicons = collection.heroicons

    await collectionModel.save()

    return CollectionMapper.toDomain(collectionModel)
  }

  async associate_tags(tagsId: number[], collection: Collection): Promise<Collection> {
    const collectionModel = await CollectionModel.find(collection.id)
    if (!collectionModel) {
      throw new Error(`NotFound: Collection with ID: ${collection.id} not found`)
    }

    await collectionModel.related('tags').sync(tagsId)

    await collectionModel.load('tags')

    return CollectionMapper.toDomain(collectionModel)
  }
}
