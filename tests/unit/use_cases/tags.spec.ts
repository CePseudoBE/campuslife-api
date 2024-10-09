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
  async findById(id: number): Promise<Tag | null> {
    const tags = [
      {
        id: 1,
        titleJson: { en: 'Tag 1', fr: 'Étiquette 1' },
        slugTitle: 'tag-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        waypoints: [],
        events: [],
        delete: function () {},
      },
      {
        id: 2,
        titleJson: { en: 'Tag 2', fr: 'Étiquette 2' },
        slugTitle: 'tag-2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        waypoints: [],
        events: [],
        delete: function () {},
      },
    ]

    return tags.find((tag) => tag.id === id) || null
  },
  findBySlug(slug: string, includes?: string[]): Promise<Tag | null> {
    return Promise.resolve(undefined)
  },
  update(tag: Tag): Promise<Tag> {
    return Promise.resolve(undefined)
  },
}
