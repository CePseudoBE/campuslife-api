import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { QueryParams } from '#domain/services/sorting_validation'
import { FindCountriesUseCase } from '#domain/use_cases/countries/find_countries_use_case'

@inject()
export default class FindCountriesController {
  constructor(private findCountriesUseCase: FindCountriesUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const countries = await this.findCountriesUseCase.handle(queryParams)

      return ctx.response.ok({ data: countries })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
