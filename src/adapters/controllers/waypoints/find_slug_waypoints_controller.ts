import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ValidationService } from '#adapters/services/validation_service'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { WaypointDTO } from '#adapters/dto/waypoint_dto'
import { FindSlugWaypointUseCase } from '#domain/use_cases/waypoints/find_slug_waypoint_use_case'

@inject()
export default class FindSlugWaypointController {
  constructor(private findSlugWaypointUseCase: FindSlugWaypointUseCase) {}
  async handle(ctx: HttpContext) {
    const slug = ctx.params.slug

    const lang = ctx.params.lang

    try {
      const validIncludes = await ValidationService.validateRequestAndIncludes(ctx, WaypointModel)

      const waypoint = await this.findSlugWaypointUseCase.handle({ slug, includes: validIncludes })

      if (!waypoint) {
        return ctx.response.badRequest({ message: `Waypoint with slug : ${slug} does not exist` })
      }

      const waypointDto = WaypointDTO.toLanguages(waypoint, lang, validIncludes)

      return ctx.response.ok({ data: waypointDto })
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
