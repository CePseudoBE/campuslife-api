import { ITagRepository } from '#domain/repositories/itag_repository'
import { ISlugService } from '#domain/services/islug_service'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateTagUseCase {
  constructor(
    private iTagRepository: ITagRepository,
    private iSlugService: ISlugService
  ) {}

  public async handle(id: number, data: { title_en?: string; title_fr?: string; slug?: string }) {
    const existingTag = await this.iTagRepository.findById(id)
    if (!existingTag) {
      throw new Error(`NotFound: Tag with id : ${id} not found`)
    }

    let slug = existingTag.slug
    if (data.title_en && data.title_en !== existingTag.title.en) {
      slug = this.iSlugService.generate(data.title_en)

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

      data = {
        ...data,
        slug: slug,
      }
    }

    existingTag.update(data)

    return await this.iTagRepository.update(existingTag)
  }
}
