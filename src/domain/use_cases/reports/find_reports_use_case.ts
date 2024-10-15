import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { IReportRepository } from '#domain/repositories/ireport_repository'
import { Report } from '#domain/entities/report'

@inject()
export class FindReportsUseCase {
  constructor(
    private iReportRepository: IReportRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<Report[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: Report.allowedColumns }
    )
    return await this.iReportRepository.findAll(queryParams)
  }
}
