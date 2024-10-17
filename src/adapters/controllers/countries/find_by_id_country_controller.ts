import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdCountryUseCase } from '#domain/use_cases/countries/find_by_id_country_use_case'

@inject()
export default class FindByIdLogController {
  constructor(private findByIdCountryUseCase: FindByIdCountryUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    try {
      const country = await this.findByIdCountryUseCase.handle({ id })

      if (!country) {
        return ctx.response.badRequest({ message: `Country with id : ${id} does not exist` })
      }

      return ctx.response.ok({ data: country })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
