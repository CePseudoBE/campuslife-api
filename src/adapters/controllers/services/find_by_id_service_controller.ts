import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdServiceUseCase } from '#domain/use_cases/services/find_by_id_service_use_case'

@inject()
export default class FindByIdServiceController {
  constructor(private findByIdServiceUseCase: FindByIdServiceUseCase) {}

  public async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)
    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'InvalidFormat: Bad ID provided' })
    }
    try {
      const service = await this.findByIdServiceUseCase.handle(id)

      return ctx.response.ok({ data: service })
    } catch (error) {
      return ctx.response.badRequest({ message: error.message })
    }
  }
}
