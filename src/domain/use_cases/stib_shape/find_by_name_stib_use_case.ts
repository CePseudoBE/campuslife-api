import { inject } from '@adonisjs/core'
import { IStibRepository } from '#domain/repositories/istib_repository'
import { StibShape } from '#domain/entities/stib_shape'

@inject()
export class FindByNameStibUseCase {
  constructor(private iStibRepository: IStibRepository) {}

  public async handle(data: { name: string }): Promise<StibShape> {
    return await this.iStibRepository.findByName(data.name)
  }
}
