import { QueryParams } from '#domain/services/sorting_validation'
import { Collection } from '#domain/entities/collection'

export abstract class ICollectionRepository {
  abstract create(collection: Collection): Promise<Collection>

  abstract findById(id: number, connected: boolean, includes?: string[]): Promise<Collection>

  abstract findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Collection[]>

  abstract update(collection: Collection): Promise<Collection>

  abstract delete(collection: Collection): Promise<null>

  abstract associate_tags(tagsId: number[], collection: Collection): Promise<Collection>
}
