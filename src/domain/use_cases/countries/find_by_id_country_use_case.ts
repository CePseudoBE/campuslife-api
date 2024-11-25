import { inject } from '@adonisjs/core'
import { ICountryRepository } from '#domain/repositories/icountry_repository'
import { Country } from '#domain/entities/country'

@inject()
export class FindByIdCountryUseCase {
  constructor(private iCountryRepository: ICountryRepository) {}

  public async handle(data: { id: number }): Promise<Country> {
    const country = await this.iCountryRepository.findById(data.id)

    if (!country) {
      new Error(`NotFound: Collection with id ${data.id} not found`)
    }

    return country
  }
}
