import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindEventsUseCase } from '#domain/use_cases/events/find_events_use_case'
import { ValidationService } from '#adapters/services/validation_service'
import EventModel from '#infrastructure/orm/models/event_model'
import { QueryParams } from '#domain/services/sorting_validation'

@inject()
export default class FindEventsController {
  constructor(private findEventsUseCase: FindEventsUseCase) {}

  public async handle(ctx: HttpContext) {
    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, EventModel)
      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }
      const deletedParam = ctx.request.input('deleted')

      if (deletedParam !== undefined) {
        if (deletedParam !== 'true' && deletedParam !== 'false') {
          return ctx.response.badRequest({
            message: 'InvalidFormat: deleted needs to be true or false',
          })
        }
      }

      const deleted = deletedParam === 'true' ? true : deletedParam === 'false' ? false : undefined

      if (deleted === null) {
        return ctx.response.badRequest({
          message: 'InvalidFormat: deleted needs to be true or false',
        })
      }

      const events = await this.findEventsUseCase.handle(queryParams, validIncludes, deleted)

      return ctx.response.ok({ data: events })
    } catch (error) {
      return ctx.response.badRequest({ message: error.message })
    }
  }
}
