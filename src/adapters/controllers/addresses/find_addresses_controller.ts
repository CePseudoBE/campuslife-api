import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { QueryParams } from '#domain/services/sorting_validation'
import { FindAddressesUseCase } from '#domain/use_cases/addresses/find_addresses_use_case'

@inject()
export default class FindAddressesController {
  constructor(private findAddressessUseCase: FindAddressesUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const addresses = await this.findAddressessUseCase.handle(queryParams)

      return ctx.response.ok({ data: addresses })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
