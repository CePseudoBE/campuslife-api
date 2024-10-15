import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DeleteLogUseCase } from '#domain/use_cases/logs/delete_log_use_case'

@inject()
export default class DeleteLogController {
  constructor(private deleteLogUseCase: DeleteLogUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }
    try {
      await this.deleteLogUseCase.handle(id)

      return ctx.response.noContent()
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
