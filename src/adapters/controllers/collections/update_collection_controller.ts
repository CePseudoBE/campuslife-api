import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { UpdateCollectionUseCase } from '#domain/use_cases/collections/update_collection_use_case'

@inject()
export default class UpdateCollectionController {
  constructor(private updateCollectionUseCase: UpdateCollectionUseCase) {}

  async handle({ request, response, params }: HttpContext) {
    const body = request.only(['name_en', 'name_fr', 'heroicons'])

    const id = Number(params.id)

    if (Number.isNaN(id)) {
      return response.badRequest({ message: 'Invalid tag ID' })
    }

    const schema = ValidationService.getUpdateCollectionRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const collection = await this.updateCollectionUseCase.handle(id, validatedData)

      return response.ok({ data: collection })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
