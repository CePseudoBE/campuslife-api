import { inject } from '@adonisjs/core'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'

@inject()
export class DeleteCollectionUseCase {
  constructor(private iCollectionRepository: ICollectionRepository) {}

  public async handle(id: number): Promise<null> {
    const collection = await this.iCollectionRepository.findById(id)
    collection.delete()
    return await this.iCollectionRepository.delete(collection)
  }
}
