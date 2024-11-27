import { IAddressRepository } from '#domain/repositories/iaddress_repository'
import { inject } from '@adonisjs/core'
@inject()
export class DeleteAddressUseCase {
  constructor(private iAddressRepository: IAddressRepository) {}
  public async handle(id: number): Promise<null> {
    const address = await this.iAddressRepository.findById(id)
    if (!address) {
      throw new Error(`NotFound: tag with id ${id} not found`)
    }
    address.delete()
    return await this.iAddressRepository.delete(address)
  }
}
