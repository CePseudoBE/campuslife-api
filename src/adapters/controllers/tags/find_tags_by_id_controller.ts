import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import { TagDTO } from '#adapters/dto/tag_dto'
import { FindByIdTagUseCase } from '#domain/use_cases/tags/find_by_id_tag_use_case'
import TagModel from '#infrastructure/orm/models/tag_model'

@inject()
export default class FindTagByIdController {
  constructor(private findByIdTagUseCase: FindByIdTagUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    const lang = ctx.params.lang

    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, TagModel)

      const tag = await this.findByIdTagUseCase.handle({ id, includes: validIncludes })

      if (!tag) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      const tagDTO = TagDTO.toLanguages(tag, lang, validIncludes)

      return ctx.response.ok({ data: tagDTO })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
