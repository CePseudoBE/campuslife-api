import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'
import { QueryParams } from '#domain/services/sorting_validation'

export const mockTagRepository: ITagRepository = {
  async create(tag: Tag): Promise<Tag> {
    tag.id = 1
    return tag
  },
  delete(tag: Tag): Promise<null> {
    return Promise.resolve(null)
  },
  findAll({ page, limit, order, column }: QueryParams, includes: string[]): Promise<Tag[]> {
    return Promise.resolve([])
  },
  findById(id: number, includes?: string[]): Promise<Tag | null> {
    return Promise.resolve(undefined)
  },
  findBySlug(slug: string, includes?: string[]): Promise<Tag | null> {
    return Promise.resolve(undefined)
  },
  update(tag: Tag): Promise<Tag> {
    return Promise.resolve(undefined)
  },
}
