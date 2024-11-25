import { inject } from '@adonisjs/core'
import { IStibRepository } from '#domain/repositories/istib_repository'

@inject()
export class DeleteStibUseCase {
  constructor(private iStibRepository: IStibRepository) {}

  public async handle(id: number): Promise<null> {
    const stibShape = await this.iStibRepository.findById(id)
    if (!stibShape) {
      throw new Error(`NotFound: Stib shape with id ${id} not found`)
    }
    return await this.iStibRepository.delete(stibShape)
  }
}
