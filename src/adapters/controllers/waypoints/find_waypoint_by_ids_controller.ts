import type { HttpContext } from '@adonisjs/core/http'
import { FindByIdWaypointUseCase } from '#domain/use_cases/waypoints/find_by_id_waypoint_use_case'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'

@inject()
export default class FindWaypointByIdsController {
  constructor(private findWaypointByIdUseCase: FindByIdWaypointUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }
    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, WaypointModel)

      const waypoint = await this.findWaypointByIdUseCase.handle({ id, includes: validIncludes })

      if (!waypoint) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      return ctx.response.ok({ data: waypoint })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
