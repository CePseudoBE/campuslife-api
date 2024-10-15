import { ITagRepository } from '#domain/repositories/itag_repository'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateTagUseCase {
  constructor(private iTagRepository: ITagRepository) {}

  public async handle(id: number, data: { title_en?: string; title_fr?: string }) {
    const existingTag = await this.iTagRepository.findById(id, false)
    if (!existingTag) {
      throw new Error(`NotFound: Tag with id : ${id} not found`)
    }

    existingTag.update(data)

    return await this.iTagRepository.update(existingTag)
  }
}
