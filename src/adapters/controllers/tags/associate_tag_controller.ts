import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { AssociateTagsCollectionsUseCase } from '#domain/use_cases/tags/associate_tags_collections_use_case'

@inject()
export default class AssociateTagController {
  constructor(private associateTagsCollectionsUseCase: AssociateTagsCollectionsUseCase) {}

  async handle({ request, response, params }: HttpContext) {
    const body = request.only(['collections'])
    const id = Number(params.id)

    if (!id || Number.isNaN(id)) {
      return response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    const schema = vine.array(vine.number())

    try {
      const validatedData = await vine.validate({
        schema,
        data: body.collections,
      })

      const tags = await this.associateTagsCollectionsUseCase.handle({
        id,
        collections: validatedData,
      })

      return response.created({ data: tags })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
