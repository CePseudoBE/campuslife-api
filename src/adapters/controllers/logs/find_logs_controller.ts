import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { QueryParams } from '#domain/services/sorting_validation'
import { FindLogUseCase } from '#domain/use_cases/logs/find_logs_use_case'

@inject()
export default class FindCollectionsController {
  constructor(private findLogUseCase: FindLogUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const logs = await this.findLogUseCase.handle(queryParams)

      return ctx.response.ok({ data: logs })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
