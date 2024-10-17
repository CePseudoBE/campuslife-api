import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIsoUseCase } from '#domain/use_cases/countries/find_by_iso_use_case'

@inject()
export default class FindByIdLogController {
  constructor(private findByIsoUseCase: FindByIsoUseCase) {}
  async handle(ctx: HttpContext) {
    const iso = ctx.params.iso

    try {
      const country = await this.findByIsoUseCase.handle(iso)

      if (!country) {
        return ctx.response.badRequest({ message: `Country with iso : ${iso} does not exist` })
      }

      return ctx.response.ok({ data: country })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
