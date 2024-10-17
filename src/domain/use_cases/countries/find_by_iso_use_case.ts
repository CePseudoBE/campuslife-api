import { inject } from '@adonisjs/core'
import { Country } from '#domain/entities/country'
import { ICountryRepository } from '#domain/repositories/icountry_repository'

@inject()
export class FindByIsoUseCase {
  constructor(private iCountryRepository: ICountryRepository) {}

  public async handle(iso: string): Promise<Country> {
    return await this.iCountryRepository.findByIso(iso)
  }
}
