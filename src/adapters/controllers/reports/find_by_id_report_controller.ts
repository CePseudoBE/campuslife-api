import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdReportUseCase } from '#domain/use_cases/reports/find_by_id_report_use_case'

@inject()
export default class FindByIdReportController {
  constructor(private findByIdReportUseCase: FindByIdReportUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    try {
      const report = await this.findByIdReportUseCase.handle({
        id,
        connected: ctx.auth.isAuthenticated,
      })

      if (!report) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      return ctx.response.ok({ data: report })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
