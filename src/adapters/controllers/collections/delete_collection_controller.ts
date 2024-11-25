import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DeleteCollectionUseCase } from '#domain/use_cases/collections/delete_collection_use_case'

@inject()
export default class DeleteCollectionController {
  constructor(private deleteCollectionUseCase: DeleteCollectionUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'InvalidFormat: Bad ID provided' })
    }
    try {
      await this.deleteCollectionUseCase.handle(id)

      return ctx.response.noContent()
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
