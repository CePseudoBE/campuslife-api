import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DeleteStibUseCase } from '#domain/use_cases/stib_shape/delete_stib_use_case'

@inject()
export default class DeleteStibController {
  constructor(private deleteStibUseCase: DeleteStibUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }
    try {
      await this.deleteStibUseCase.handle(id)

      return ctx.response.noContent()
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
