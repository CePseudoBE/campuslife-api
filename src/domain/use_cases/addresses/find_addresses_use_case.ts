import { inject } from '@adonisjs/core'
import { QueryParams, QueryValidationService } from '#domain/services/sorting_validation'
import { IAddressRepository } from '#domain/repositories/iaddress_repository'
import { Address } from '#domain/entities/address'

@inject()
export class FindCountriesUseCase {
  constructor(
    private iAddressRepository: IAddressRepository,
    private sortingValidation: QueryValidationService
  ) {}

  public async handle({ page, limit, order, column }: QueryParams): Promise<Address[]> {
    const queryParams = this.sortingValidation.validateAndSanitizeQueryParams(
      {
        page,
        limit,
        order,
        column,
      },
      { allowedColumns: Address.allowedColumns }
    )
    return await this.iAddressRepository.findAll(queryParams)
  }
}
