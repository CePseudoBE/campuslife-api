import { Address } from '#domain/entities/address'
import { IAddressRepository } from '#domain/repositories/iaddress_repository'
import { inject } from '@adonisjs/core'
@inject()
export class FindByIdAddressUseCase {
  constructor(private iAddressRepository: IAddressRepository) {}

  public async handle(data: { id: number }): Promise<Address> {
    const address = await this.iAddressRepository.findById(data.id)
    if (!address) {
      throw new Error(`NotFound: Address with id ${data.id} not found`)
    }
    return address
  }
}
