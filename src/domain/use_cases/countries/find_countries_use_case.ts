import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { Country } from '#domain/entities/country'
import { ICountryRepository } from '#domain/repositories/icountry_repository'

@inject()
export class FindCountriesUseCase {
  constructor(
    private iCountryRepository: ICountryRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<Country[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: Country.allowedColumns }
    )
    return await this.iCountryRepository.findAll(queryParams)
  }
}
