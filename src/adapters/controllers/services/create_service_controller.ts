import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateServiceUseCase } from '#domain/use_cases/services/create_service_use_case'

@inject()
export default class CreateServiceController {
  constructor(private createServiceUseCase: CreateServiceUseCase) {}

  public async handle({ request, response }: HttpContext) {
    try {
      const body = request.only(['title', 'description', 'url', 'icon', 'isActive'])

      const validatedData = await vine.validate({
        schema: ValidationService.getServiceRules(),
        data: body,
      })

      const service = await this.createServiceUseCase.handle(validatedData)

      return response.created({ data: service })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
