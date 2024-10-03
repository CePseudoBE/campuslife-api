import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DeleteWaypointUseCase } from '#domain/use_cases/waypoints/delete_waypoint_use_case'

@inject()
export default class DeleteWaypointController {
  constructor(private deleteWaypointUseCase: DeleteWaypointUseCase) {}
  async handle(ctx: HttpContext) {
    const id = Number.parseInt(ctx.params.id)

    if (!id || Number.isNaN(id)) {
      return ctx.response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }
    try {
      await this.deleteWaypointUseCase.handle(id)

      return ctx.response.noContent()
    } catch (err) {
      return ctx.response.badRequest({ message: err.message })
    }
  }
}
