import { inject } from '@adonisjs/core'
import { ICountryRepository } from '#domain/repositories/icountry_repository'

@inject()
export class DeleteCountryUseCase {
  constructor(private iCountryRepository: ICountryRepository) {}

  public async handle(id: number): Promise<null> {
    const country = await this.iCountryRepository.findById(id)
    if (!country) {
      throw new Error(`NotFound: country with id ${id} not found`)
    }
    return await this.iCountryRepository.delete(country)
  }
}
