import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { IEventRepository } from '#domain/repositories/ievent_repository'
import { Event } from '#domain/entities/event'

@inject()
export class FindEventsUseCase {
  constructor(
    private iEventRepository: IEventRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Event[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: Event.allowedColumns }
    )
    return await this.iEventRepository.findAll(queryParams, includes, deleted)
  }
}
