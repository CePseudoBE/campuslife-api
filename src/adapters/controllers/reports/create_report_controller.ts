import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateReportUseCase } from '#domain/use_cases/reports/create_report_use_case'

@inject()
export default class CreateReportController {
  constructor(private createReportUseCase: CreateReportUseCase) {}

  async handle({ request, response }: HttpContext) {
    const body = request.only(['sessionId', 'deviceId', 'message', 'contact'])

    const schema = ValidationService.getReportRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const report = await this.createReportUseCase.handle(validatedData)

      return response.created({ data: report })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
