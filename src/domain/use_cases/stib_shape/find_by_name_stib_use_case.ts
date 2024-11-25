import { inject } from '@adonisjs/core'
import { IStibRepository } from '#domain/repositories/istib_repository'
import { StibShape } from '#domain/entities/stib_shape'

@inject()
export class FindByNameStibUseCase {
  constructor(private iStibRepository: IStibRepository) {}

  public async handle(data: { name: string }): Promise<StibShape> {
    const stibShape = await this.iStibRepository.findByName(data.name)
    if (!stibShape) {
      throw new Error(`NotFound: Stib shape with name ${data.name} not found`)
    }
    return stibShape
  }
}
