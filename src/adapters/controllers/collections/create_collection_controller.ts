import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateCollectionUseCase } from '#domain/use_cases/collections/create_collection_use_case'

@inject()
export default class CreateCollectionController {
  constructor(private createCollectionUseCase: CreateCollectionUseCase) {}

  async handle({ request, response }: HttpContext) {
    const body = request.only(['name_en', 'name_fr', 'heroicons', 'tags'])

    const schema = ValidationService.getCollectionRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const tag = await this.createCollectionUseCase.handle(validatedData)

      return response.created({ data: tag })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
