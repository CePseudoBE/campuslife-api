import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { QueryParams } from '#domain/services/sorting_validation'
import { FindStibsUseCase } from '#domain/use_cases/stib_shape/find_stibs_use_case'

@inject()
export default class FindStibsController {
  constructor(private findStibsUseCase: FindStibsUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const stibShapes = await this.findStibsUseCase.handle(queryParams)

      return ctx.response.ok({ data: stibShapes })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
