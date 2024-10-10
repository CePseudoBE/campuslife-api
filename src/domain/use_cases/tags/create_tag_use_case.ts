import { inject } from '@adonisjs/core'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class CreateTagUseCase {
  constructor(private iTagRepository: ITagRepository) {}

  public async handle(data: { title_en: string; title_fr: string; slug?: string }): Promise<Tag> {
    const title: MultilingualField = {
      en: data.title_en || '',
      fr: data.title_fr || '',
    }

    if (!data.title_en || !data.title_fr) {
      throw Error('Title is required')
    }

    const tag = new Tag(null, title, new Date(), new Date())

    return await this.iTagRepository.create(tag)
  }
}
