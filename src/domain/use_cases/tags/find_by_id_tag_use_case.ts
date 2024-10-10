import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class FindByIdTagUseCase {
  constructor(private iTagRepository: ITagRepository) {}

  public async handle(data: { id: number; includes?: string[] }): Promise<Tag | null> {
    return await this.iTagRepository.findById(data.id, data.includes)
  }
}
