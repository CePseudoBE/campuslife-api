import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindServicesUseCase } from '#domain/use_cases/services/find_services_use_case'

@inject()
export default class FindServicesController {
  constructor(private findServicesUseCase: FindServicesUseCase) {}

  public async handle(ctx: HttpContext) {
    try {
      const queryParams = ctx.request.only(['page', 'limit', 'order', 'column'])

      const services = await this.findServicesUseCase.handle({
        page: Number(queryParams.page) || undefined,
        limit: Number(queryParams.limit) || undefined,
        order: queryParams.order || undefined,
        column: queryParams.column || undefined,
      })

      return ctx.response.ok({ data: services })
    } catch (error) {
      return ctx.response.badRequest({ message: error.message })
    }
  }
}
