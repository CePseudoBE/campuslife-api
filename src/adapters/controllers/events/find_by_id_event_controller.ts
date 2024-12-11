import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindByIdEventUseCase } from '#domain/use_cases/events/find_by_id_event_use_case'
import EventModel from '#infrastructure/orm/models/event_model'
import { ValidationService } from '#adapters/services/validation_service'

@inject()
export default class FindByIdEventController {
  constructor(private findByIdEventUseCase: FindByIdEventUseCase) {}

  public async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)
    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'InvalidFormat: Bad ID provided' })
    }
    try {
      //const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, EventModel)
      const event = await this.findByIdEventUseCase.handle({
        id: id,
        connected: true,
      })

      return ctx.response.ok({ data: event })
    } catch (error) {
      return ctx.response.badRequest({ message: error.message })
    }
  }
}
