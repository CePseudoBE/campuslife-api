import { FindByNameStibUseCase } from '#domain/use_cases/stib_shape/find_by_name_stib_use_case'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FindByNameStibController {
  constructor(private findByNameStibUseCase: FindByNameStibUseCase) {}

  async handle(ctx: HttpContext) {
    const name = ctx.params.ligne

    try {
      const stib = this.findByNameStibUseCase.handle({ name })

      return ctx.response.ok({ data: stib })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
