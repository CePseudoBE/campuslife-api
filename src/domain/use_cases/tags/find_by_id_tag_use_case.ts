import { inject } from '@adonisjs/core'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class FindByIdTagUseCase {
  constructor(private iTagRepository: ITagRepository) {}

  public async handle(data: {
    id: number
    connected: boolean
    includes?: string[]
  }): Promise<Tag | null> {
    const tag = await this.iTagRepository.findById(data.id, data.connected, data.includes)

    if (!tag) {
      throw new Error(`NotFound: tag with id ${data.id} not found`)
    }
    return tag
  }
}
