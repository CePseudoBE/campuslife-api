import { ValidationService } from '#adapters/services/validation_service'
import { CreateAddressUseCase } from '#domain/use_cases/addresses/create_address_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
@inject()
export default class CreateAddressController {
  constructor(private createAddressUseCase: CreateAddressUseCase) {}
  async handle({ request, response }: HttpContext) {
    const body = request.only(['street', 'num', 'complement', 'zip', 'city', 'country_id'])

    const schema = ValidationService.getAddressRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })
      const address = await this.createAddressUseCase.handle(validatedData)
      return response.created({ data: address })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
