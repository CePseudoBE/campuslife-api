import { inject } from '@adonisjs/core'
import { IServiceRepository } from '#domain/repositories/iservice_repository'
import { Service } from '#domain/entities/service'

@inject()
export class FindByIdServiceUseCase {
  constructor(private serviceRepository: IServiceRepository) {}

  public async handle(id: number): Promise<Service> {
    const service = await this.serviceRepository.findById(id)
    if (!service) {
      throw new Error(`NotFound: Service with id ${id} not found`)
    }
    return service
  }
}
