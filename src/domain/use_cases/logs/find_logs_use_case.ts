import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { ILogRepository } from '#domain/repositories/ilog_repository'
import { Log } from '#domain/entities/log'

@inject()
export class FindLogUseCase {
  constructor(
    private iLogRepository: ILogRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<Log[]> {
    try {
      const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
        {
          page,
          limit,
          order,
          column,
        },
        { allowedColumns: Log.allowedColumns }
      )
      return await this.iLogRepository.findAll(queryParams)
    } catch (error) {
      throw new Error('NotFound. Please check your query parameters.')
    }
  }
}
