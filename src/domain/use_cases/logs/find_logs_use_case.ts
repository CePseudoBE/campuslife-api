import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { ILogRepository } from '#domain/repositories/ilog_repository'
import { Log } from '#domain/entities/log'

@inject()
export class FindLosUseCase {
  constructor(
    private iLogRepository: ILogRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<Log[]> {
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
  }
}
