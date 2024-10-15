import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { QueryParams } from '#domain/services/sorting_validation'
import { FindReportsUseCase } from '#domain/use_cases/reports/find_reports_use_case'

@inject()
export default class FindReportsController {
  constructor(private findReportsUseCase: FindReportsUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const reports = await this.findReportsUseCase.handle(queryParams)

      return ctx.response.ok({ data: reports })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
