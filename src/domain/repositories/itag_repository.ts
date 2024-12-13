import { QueryParams } from '#domain/services/sorting_validation'
import { Tag } from '#domain/entities/tag'

export abstract class ITagRepository {
  abstract create(tag: Tag): Promise<Tag>

  abstract findById(id: number, connected: boolean, includes?: string[]): Promise<Tag>

  abstract findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Tag[]>

  abstract update(tag: Tag): Promise<Tag>

  abstract delete(tag: Tag): Promise<null>

  abstract associateCollections(idCollections: number[], tag: Tag): Promise<Tag>

  abstract findByCollectionId(collectionId: number): Promise<Tag[]>
}
