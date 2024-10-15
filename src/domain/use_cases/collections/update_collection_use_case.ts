import { inject } from '@adonisjs/core'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'

@inject()
export class UpdateCollectionUseCase {
  constructor(private iCollectionRepository: ICollectionRepository) {}

  public async handle(
    id: number,
    data: { name_en?: string; name_fr?: string; heroicons?: string }
  ) {
    const existingCollection = await this.iCollectionRepository.findById(id, false)
    if (!existingCollection) {
      throw new Error(`NotFound: Tag with id : ${id} not found`)
    }

    existingCollection.update(data)

    return await this.iCollectionRepository.update(existingCollection)
  }
}
