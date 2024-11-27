import { Address } from '#domain/entities/address'
import { IAddressRepository } from '#domain/repositories/iaddress_repository'
import { ICountryRepository } from '#domain/repositories/icountry_repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateAddressUseCase {
  constructor(
    private iAddressRepository: IAddressRepository,
    private iCountryRepository: ICountryRepository
  ) {}

  public async handle(data: {
    street: string
    num: string
    complement?: string
    zip: string
    city: string
    country_id: number
  }): Promise<Address> {
    if (!data.street || !data.num || !data.zip || !data.city || !data.country_id) {
      throw new Error('InvalidFormat: All required param must be provided')
    }

    const country = await this.iCountryRepository.findById(data.country_id)
    if (!country) {
      throw new Error(`NotFound: Country with ID ${data.country_id} does not exist`)
    }

    const address = new Address(
      null,
      data.street,
      data.num,
      data.zip,
      data.city,
      data.country_id,
      new Date(),
      new Date(),
      null,
      data.complement
    )

    return await this.iAddressRepository.create(address)
  }
}
