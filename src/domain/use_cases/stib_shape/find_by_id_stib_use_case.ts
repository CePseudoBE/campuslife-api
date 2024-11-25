import { inject } from '@adonisjs/core'
import { IStibRepository } from '#domain/repositories/istib_repository'
import { StibShape } from '#domain/entities/stib_shape'

@inject()
export class FindByIdStibUseCase {
  constructor(private iStibRepository: IStibRepository) {}

  public async handle(data: { id: number }): Promise<StibShape | null> {
    const stib = await this.iStibRepository.findById(data.id)

    if (!stib) {
      throw new Error(`NotFound: Stib shape with id ${data.id} not found`)
    }
    return stib
  }
}
