import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateLogUseCase } from '#domain/use_cases/logs/create_log_use_case'

@inject()
export default class CreateLogController {
  constructor(private createLogUseCase: CreateLogUseCase) {}

  async handle({ request, response }: HttpContext) {
    const body = request.only(['sessionId', 'userId', 'actionState', 'actionType', 'actionInfo'])

    const schema = ValidationService.getLogRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const tag = await this.createLogUseCase.handle(validatedData)

      return response.created({ data: tag })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
