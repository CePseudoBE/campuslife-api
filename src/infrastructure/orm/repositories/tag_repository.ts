import { ITagRepository } from '#domain/repositories/itag_repository'
import { inject } from '@adonisjs/core'
import { Tag } from '#domain/entities/tag'
import { QueryParams } from '#domain/services/sorting_validation'
import { TagMapper } from '#adapters/mappers/tag_mapper'

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

  delete(tag: Tag): Promise<null> {
    return Promise.resolve(null)
  }

  findAll({ page, limit, order, column }: QueryParams, includes: string[]): Promise<Tag[]> {
    return Promise.resolve([])
  }

  findById(id: number, includes?: string[]): Promise<Tag | null> {
    return Promise.resolve(undefined)
  }

  update(tag: Tag): Promise<Tag> {
    return Promise.resolve(undefined)
  }
}
