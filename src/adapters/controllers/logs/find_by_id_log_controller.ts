import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdLogUseCase } from '#domain/use_cases/logs/find_by_id_log_use_case'

@inject()
export default class FindByIdLogController {
  constructor(private findByIdLogUseCase: FindByIdLogUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    try {
      const log = await this.findByIdLogUseCase.handle({ id })

      if (!log) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      return ctx.response.ok({ data: log })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
