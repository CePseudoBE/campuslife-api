import { inject } from '@adonisjs/core'
import { ICountryRepository } from '#domain/repositories/icountry_repository'
import { Country } from '#domain/entities/country'

@inject()
export class CreateCountryUseCase {
  constructor(private iCountryRepository: ICountryRepository) {}

  public async handle(data: { name: string; iso: string }): Promise<Country> {
    const country = new Country(null, data.name, data.iso)

    return await this.iCountryRepository.create(country)
  }
}
