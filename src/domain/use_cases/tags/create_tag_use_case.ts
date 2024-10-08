import { inject } from '@adonisjs/core'
import { ISlugService } from '#domain/services/islug_service'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class CreateWaypointUseCase {
  constructor(
    private itagrepository: ITagRepository,
    private iSlugService: ISlugService
  ) {}

  public async handle(data: { title_en: string; title_fr: string; slug?: string }): Promise<Tag> {
    const title: MultilingualField = {
      en: data.title_en || '',
      fr: data.title_fr || '',
    }

    if (!data.title_en || !data.title_fr) {
      throw Error('Title is required')
    }

    const slug = data.slug ? data.slug : this.iSlugService.generate(data.title_en)

    const tag = new Tag(null, title, slug, new Date(), new Date())

    return await this.itagrepository.create(tag)
  }
}
