import { DeleteAddressUseCase } from '#domain/use_cases/addresses/delete_address_use_case'
import { HttpContext } from '@adonisjs/core/http'

export class DeleteAddressController {
  constructor(private deleteAddressUseCase: DeleteAddressUseCase) {}

  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'InvalidFormat: Bad ID provided' })
    }
    try {
      await this.deleteAddressUseCase.handle(id)

      return ctx.response.noContent()
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
