import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { FindWaypointsUseCase } from '#domain/use_cases/waypoints/find_waypoints_use_case'
import { QueryParams } from '#domain/services/sorting_validation'

@inject()
export default class FindWaypointsController {
  constructor(private findWaypointsUseCase: FindWaypointsUseCase) {}

  async handle(ctx: HttpContext) {
    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, WaypointModel)

      const queryParams: QueryParams = {
        page: ctx.request.input('page'),
        limit: ctx.request.input('limit'),
        order: ctx.request.input('order'),
        column: ctx.request.input('column'),
      }

      const waypoints = await this.findWaypointsUseCase.handle(queryParams, validIncludes)

      return ctx.response.ok({ data: waypoints })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
