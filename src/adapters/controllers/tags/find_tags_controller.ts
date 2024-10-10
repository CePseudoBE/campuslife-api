import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import { QueryParams } from '#domain/services/sorting_validation'
import { TagDTO } from '#adapters/dto/tag_dto'
import { FindTagsUseCase } from '#domain/use_cases/tags/find_tags_use_case'
import TagModel from '#infrastructure/orm/models/tag_model'

@inject()
export default class FindWaypointsController {
  constructor(private findTagsUseCase: FindTagsUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, TagModel)

      const lang = ctx.params.lang

      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const tags = await this.findTagsUseCase.handle(queryParams, validIncludes)

      const tagsDTO = tags.map((tag) => TagDTO.toLanguages(tag, lang, validIncludes))

      return ctx.response.ok({ data: tagsDTO })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
