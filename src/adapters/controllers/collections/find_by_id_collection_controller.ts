import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import TagModel from '#infrastructure/orm/models/tag_model'
import { FindByIdCollectionUseCase } from '#domain/use_cases/collections/find_by_id_collection_use_case'
import { CollectionDTO } from '#adapters/dto/collection_dto'

@inject()
export default class FindByIdCollectionController {
  constructor(private findByIdCollectionUseCase: FindByIdCollectionUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    const lang = ctx.params.lang

    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, TagModel)

      const collection = await this.findByIdCollectionUseCase.handle({
        id,
        includes: validIncludes,
      })

      if (!collection) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      const collectionDTO = CollectionDTO.toLanguages(collection, lang, validIncludes)

      return ctx.response.ok({ data: collectionDTO })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}

//TODO: can get deleted if connected
