import { inject } from '@adonisjs/core'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { Collection } from '#domain/entities/collection'

@inject()
export class FindByIdCollectionUseCase {
  constructor(private iCollectionRepository: ICollectionRepository) {}

  public async handle(data: { id: number; includes?: string[] }): Promise<Collection | null> {
    return await this.iCollectionRepository.findById(data.id, data.includes)
  }
}
