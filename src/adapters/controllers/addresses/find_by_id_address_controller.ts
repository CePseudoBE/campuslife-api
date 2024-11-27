import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdAddressUseCase } from '#domain/use_cases/addresses/find_by_id_address_use_case'

@inject()
export default class FindByIdAddressController {
  constructor(private findByIdAddressUseCase: FindByIdAddressUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({
        message: 'InvalidFormat: Bad ID provided (non existent or NaN)',
      })
    }

    try {
      const address = await this.findByIdAddressUseCase.handle({ id })

      if (!address) {
        return ctx.response.badRequest({
          message: `NotFound: Addrese with id : ${id} does not exist`,
        })
      }

      return ctx.response.ok({ data: address })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
