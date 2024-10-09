import { inject } from '@adonisjs/core'
import { ISlugService } from '#domain/services/islug_service'
import { MultilingualField } from '#domain/types/multilingual_field.type'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { Tag } from '#domain/entities/tag'

@inject()
export class CreateTagUseCase {
  constructor(
    private iTagRepository: ITagRepository,
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

    let slug = data.slug ? data.slug : this.iSlugService.generate(data.title_en)

    let check = await this.iTagRepository.findBySlug(slug)

    let iterationCount = 0
    const maxIterations = 10

    while (check && iterationCount < maxIterations) {
      slug = this.iSlugService.slugWithRandom(slug)
      check = await this.iTagRepository.findBySlug(slug)
      iterationCount++
    }

    if (iterationCount === maxIterations) {
      throw new Error('MaxIteration: Unable to generate unique slug after several attempts')
    }

    const tag = new Tag(null, title, slug, new Date(), new Date())

    return await this.iTagRepository.create(tag)
  }
}
