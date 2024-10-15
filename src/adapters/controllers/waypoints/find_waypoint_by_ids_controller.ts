import type { HttpContext } from '@adonisjs/core/http'
import { FindByIdWaypointUseCase } from '#domain/use_cases/waypoints/find_by_id_waypoint_use_case'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { WaypointDTO } from '#adapters/dto/waypoint_dto'

@inject()
export default class FindWaypointByIdsController {
  constructor(private findWaypointByIdUseCase: FindByIdWaypointUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    const lang = ctx.params.lang

    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, WaypointModel)

      const waypoint = await this.findWaypointByIdUseCase.handle({
        id,
        connected: ctx.auth.isAuthenticated,
        includes: validIncludes,
      })

      if (!waypoint) {
        return ctx.response.badRequest({ message: `Waypoint with id : ${id} does not exist` })
      }

      const waypointDto = WaypointDTO.toLanguages(waypoint, lang, validIncludes)

      return ctx.response.ok({ data: waypointDto })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
