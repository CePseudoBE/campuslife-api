import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateTagUseCase } from '#domain/use_cases/tags/create_tag_use_case'

@inject()
export default class CreateTagController {
  constructor(private createTagUseCase: CreateTagUseCase) {}

  async handle({ request, response }: HttpContext) {
    const body = request.only(['title_en', 'title_fr', 'collections'])

    const schema = ValidationService.getTagRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const tag = await this.createTagUseCase.handle(validatedData)

      return response.created({ data: tag })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
