import { Event } from '#domain/entities/event'
import { QueryParams } from '#domain/services/sorting_validation'

export abstract class IEventRepository {
  abstract create(event: Event): Promise<Event>

  abstract findById(id: number, connected: boolean, includes?: string[]): Promise<Event>

  abstract findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Event[]>

  abstract update(event: Event): Promise<Event>

  abstract delete(event: Event): Promise<null>

  abstract associate_tags(tagsId: number[], event: Event): Promise<Event>
}
