import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { IStibRepository } from '#domain/repositories/istib_repository'
import { StibShape } from '#domain/entities/stib_shape'

@inject()
export class FindStibsUseCase {
  constructor(
    private iStibRepository: IStibRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<StibShape[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: StibShape.allowedColumns }
    )

    return await this.iStibRepository.findAll(queryParams)
  }
}
