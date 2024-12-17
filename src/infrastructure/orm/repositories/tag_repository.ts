import { ITagRepository } from '#domain/repositories/itag_repository'
import { inject } from '@adonisjs/core'
import { Tag } from '#domain/entities/tag'
import { QueryParams } from '#domain/services/sorting_validation'
import { TagMapper } from '#adapters/mappers/tag_mapper'
import TagModel from '#infrastructure/orm/models/tag_model'
import { DateTime } from 'luxon'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

@inject()
export class TagRepository extends ITagRepository {
  constructor() {
    super()
  }

  async create(tag: Tag): Promise<Tag> {
    const tagModel = TagMapper.toPersistence(tag)
    await tagModel.save()
    return TagMapper.toDomain(tagModel)
  }

  async delete(tag: Tag): Promise<null> {
    if (!tag.id) {
      throw new Error('NotFound: Tag not found')
    }

    const tagModel = await TagModel.query().whereNull('deleted_at').andWhere('id', tag.id).first()

    if (!tagModel) {
      throw new Error('AlreadyDelete: Tag deleted')
    }

    tagModel.deletedAt = DateTime.fromJSDate(tag.deletedAt!)

    await tagModel.save()
    return null
  }

  async findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Tag[]> {
    const query = TagModel.query()

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
      query.preload(includes[0] as ExtractModelRelations<TagModel>)
      for (let i = 1; i < includes.length; i++) {
        query.preload(includes[i] as ExtractModelRelations<TagModel>)
      }
    }

    const tagModels = await query.exec()

    return tagModels.map((tag) => TagMapper.toDomain(tag))
  }

  async findById(id: number, connected: boolean, includes?: string[]): Promise<Tag> {
    const tagModel = await TagModel.find(id)
    if (!tagModel) {
      throw new Error(`NotFound: Tag with id ${id} not found`)
    }

    if (!connected) {
      if (tagModel.deletedAt) throw new Error('AlreadyDelete: Tag deleted')
    }

    if (includes && includes.length > 0) {
      for (const relation of includes) {
        console.log(relation)
        await tagModel.load(relation as ExtractModelRelations<TagModel>)
      }
    }

    return TagMapper.toDomain(tagModel)
  }

  async update(tag: Tag): Promise<Tag> {
    if (!tag.id) {
      throw new Error(`NotFound: Tag not found`)
    }

    const tagModel = await TagModel.query().whereNull('deleted_at').andWhere('id', tag.id).first()

    if (!tagModel) {
      throw new Error('AlreadyDeleted: Tag deleted')
    }

    tagModel.title = tag.title

    await tagModel.save()

    return TagMapper.toDomain(tagModel)
  }

  async associateCollections(idCollections: number[], tag: Tag): Promise<Tag> {
    const tagModel = await TagModel.find(tag.id)
    if (!tagModel) {
      throw new Error(`NotFound: Tag with id ${tag.id} not found`)
    }

    await tagModel.related('collections').sync(idCollections)

    await tagModel.load('collections')

    return TagMapper.toDomain(tagModel)
  }

  async findByCollectionId(collectionId: number): Promise<Tag[]> {
    const tagModel = await TagModel.query()
      .join('tags_collections', 'tags.id', 'tags_collections.tag_id')
      .where('tags_collections.collection_id', collectionId)

    return tagModel.map((tag) => TagMapper.toDomain(tag))
  }
}
