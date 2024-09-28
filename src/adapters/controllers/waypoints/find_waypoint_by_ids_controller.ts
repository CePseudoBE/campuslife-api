import type { HttpContext } from '@adonisjs/core/http'
import { FindByIdWaypointUseCase } from '#domain/use_cases/waypoints/find_by_id_waypoint_use_case'
import { inject } from '@adonisjs/core'

@inject()
export default class FindWaypointByIdsController {
  constructor(private findWaypointByIdUseCase: FindByIdWaypointUseCase) {}
  async handle({ params, response }: HttpContext) {
    const id = Number.parseInt(params.id)

    if (!id || Number.isNaN(id)) {
      return response.badRequest('Bad ID provided (non existent or NaN)')
    }

    const waypoint = await this.findWaypointByIdUseCase.handle({ id })

    if (!waypoint) {
      return response.badRequest(`Waypoint with id : ${id} does not exist`)
    }

    return response.ok({ data: waypoint })
  }
}
