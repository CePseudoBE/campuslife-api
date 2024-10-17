import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdStibUseCase } from '#domain/use_cases/stib_shape/find_by_id_stib_use_case'

@inject()
export default class FindByIdStibController {
  constructor(private findByIdStibUseCase: FindByIdStibUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    try {
      const stibShape = await this.findByIdStibUseCase.handle({ id })

      if (!stibShape) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      return ctx.response.ok({ data: stibShape })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
