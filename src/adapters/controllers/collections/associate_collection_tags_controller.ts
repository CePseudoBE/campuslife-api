import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { AssociateCollectionTagsUseCase } from '#domain/use_cases/collections/associate_collection_tags_use_case'

@inject()
export default class AssociateCollectionTagsController {
  constructor(private associateCollectionTagsUseCase: AssociateCollectionTagsUseCase) {}

  async handle({ request, response, params }: HttpContext) {
    const body = request.only(['tags'])
    const id = Number(params.id)

    if (!id || Number.isNaN(id)) {
      return response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    const schema = vine.array(vine.number())

    try {
      const validatedData = await vine.validate({
        schema,
        data: body.tags,
      })

      const collections = await this.associateCollectionTagsUseCase.handle({
        id,
        tags: validatedData,
      })

      return response.created({ data: collections })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
