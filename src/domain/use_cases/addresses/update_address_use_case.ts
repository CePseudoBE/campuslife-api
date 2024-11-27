import { IAddressRepository } from '#domain/repositories/iaddress_repository'
import { inject } from '@adonisjs/core'
@inject()
export class UpdateAddressUseCase {
  constructor(private iAddressRespository: IAddressRepository) {}
  public async handle(
    id: number,
    data: {
      street?: string
      num?: string
      complement?: string
      zip?: string
      city?: string
      country_id?: number
    }
  ) {
    const address = await this.iAddressRespository.findById(id)
    if (!address) {
      throw new Error(`NotFound: Address with id ${id} not found`)
    }
    // const country = await this.iCountryRepository.findById(data.country_id)
    // if (!country) {
    //   throw new Error(`NotFound: Country with id ${data.country_id} not found`)
    // }
    address.update(data)
    return await this.iAddressRespository.update(address)
  }
}
