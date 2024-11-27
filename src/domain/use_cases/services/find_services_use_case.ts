import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'
import { Service } from '#domain/entities/service'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'

@inject()
export class FindServicesUseCase {
  constructor(
    private iserviceRepository: IServiceRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<Service[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: Service.allowedColumns }
    )
    return await this.iserviceRepository.findAll(queryParams)
  }
}
