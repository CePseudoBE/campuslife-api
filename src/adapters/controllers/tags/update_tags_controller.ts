import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { UpdateTagUseCase } from '#domain/use_cases/tags/update_tag_use_case'

@inject()
export default class UpdateTagController {
  constructor(private updateTagUseCase: UpdateTagUseCase) {}

  async handle({ request, response, params }: HttpContext) {
    const body = request.only(['title_en', 'title_fr'])

    const id = Number(params.id)

    if (Number.isNaN(id)) {
      return response.badRequest({ message: 'Invalid tag ID' })
    }

    const schema = ValidationService.getUpdateTagRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const tag = await this.updateTagUseCase.handle(id, validatedData)

      return response.ok({ data: tag })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
