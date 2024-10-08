import type { HttpContext } from '@adonisjs/core/http'
import { DeleteTagUseCase } from '#domain/use_cases/tags/delete_tag_use_case'
import { inject } from '@adonisjs/core'

@inject()
export default class DeleteTagsController {
  constructor(private deleteTagUseCase: DeleteTagUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }
    try {
      await this.deleteTagUseCase.handle(id)

      return ctx.response.noContent()
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
