import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'

@inject()
export class DeleteServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  public async handle(id: number) {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      throw new Error(`NotFound: Service with id ${id} not found`)
    }
    if (service.deletedAt) {
      throw new Error(`AlreadyDeleted: Service with id ${id} is already deleted`)
    }
    return await this.serviceRepository.delete(service)
  }
}
