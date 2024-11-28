import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DeleteServiceUseCase } from '#domain/use_cases/services/delete_service_use_case'

@inject()
export default class DeleteServiceController {
  constructor(private deleteServiceUseCase: DeleteServiceUseCase) {}

  public async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)
    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'InvalidFormat: Bad ID provided' })
    }
    try {
      await this.deleteServiceUseCase.handle(id)

      return ctx.response.noContent()
    } catch (error) {
      return ctx.response.badRequest({ message: error.message })
    }
  }
}
