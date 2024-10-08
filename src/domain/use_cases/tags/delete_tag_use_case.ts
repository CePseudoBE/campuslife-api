import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'

@inject()
export class DeleteTagUseCase {
  constructor(private itagrepository: ITagRepository) {}

  public async handle(id: number): Promise<null> {
    const tag = await this.itagrepository.findById(id)
    if (!tag) {
      throw new Error('NotFound : Tag not found')
    }
    tag.delete()
    return await this.itagrepository.delete(tag)
  }
}
