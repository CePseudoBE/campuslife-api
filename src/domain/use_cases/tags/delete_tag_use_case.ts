import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'

@inject()
export class DeleteTagUseCase {
  constructor(private itagrepository: ITagRepository) {}

  public async handle(id: number): Promise<null> {
    const tag = await this.itagrepository.findById(id, false)
    tag.delete()
    return await this.itagrepository.delete(tag)
  }
}
