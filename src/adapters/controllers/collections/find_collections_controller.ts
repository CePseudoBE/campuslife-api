import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import { QueryParams } from '#domain/services/sorting_validation'
import CollectionModel from '#infrastructure/orm/models/collection_model'
import { FindCollectionsUseCase } from '#domain/use_cases/collections/find_collections_use_case'
import { CollectionDTO } from '#adapters/dto/collection_dto'

@inject()
export default class FindCollectionsController {
  constructor(private findCollectionsUseCase: FindCollectionsUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, CollectionModel)

      const lang = ctx.params.lang

      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const deletedParam = ctx.request.input('deleted')

      if (deletedParam !== undefined) {
        if (deletedParam !== 'true' && deletedParam !== 'false') {
          return ctx.response.badRequest({
            message: 'InvalidFormat: deleted needs to be true or false',
          })
        }
      }

      const deleted = deletedParam === 'true' ? true : deletedParam === 'false' ? false : undefined

      if (deleted === null) {
        return ctx.response.badRequest({
          message: 'InvalidFormat: deleted needs to be true or false',
        })
      }

      const collections = await this.findCollectionsUseCase.handle(
        queryParams,
        validIncludes,
        deleted
      )

      const collectionsDTO = collections.map((collection) =>
        CollectionDTO.toLanguages(collection, lang, validIncludes)
      )

      return ctx.response.ok({ data: collectionsDTO })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
