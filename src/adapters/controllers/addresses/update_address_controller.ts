import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { UpdateAddressUseCase } from '#domain/use_cases/addresses/update_address_use_case'

@inject()
export default class UpdateAddressController {
  constructor(private updateAddressUseCase: UpdateAddressUseCase) {}

  public async handle({ params, request, response }: HttpContext) {
    const id = Number(params.id)
    const body = request.only(['street', 'num', 'complement', 'zip', 'city', 'country_id'])

    const schema = ValidationService.getAddressUpdateRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const updatedAddress = await this.updateAddressUseCase.handle(id, validatedData)

      return response.ok({ data: updatedAddress })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
