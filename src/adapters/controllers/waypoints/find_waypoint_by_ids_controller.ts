import type { HttpContext } from '@adonisjs/core/http'
import { FindByIdWaypointUseCase } from '#domain/use_cases/waypoints/find_by_id_waypoint_use_case'
import { inject } from '@adonisjs/core'
import { ValidationService } from '../../../services/validation_service.js'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'

@inject()
export default class FindWaypointByIdsController {
  constructor(private findWaypointByIdUseCase: FindByIdWaypointUseCase) {}
  async handle({ params, request, response }: HttpContext) {
    const id = Number.parseInt(params.id)

    if (!id || Number.isNaN(id)) {
      return response.badRequest('Bad ID provided (non existent or NaN)')
    }

    let includes = request.qs().include ? request.qs().include : []

    if (typeof includes === 'string') {
      includes = [includes]
    }

    const validIncludes = ValidationService.validateIncludes(includes, WaypointModel)

    if (validIncludes.length !== includes.length) {
      const invalidIncludes = includes.filter((rel: string) => !validIncludes.includes(rel))
      return response.badRequest({ message: `Invalid includes: ${invalidIncludes.join(', ')}` })
    }

    const waypoint = await this.findWaypointByIdUseCase.handle({ id, includes: validIncludes })

    if (!waypoint) {
      return response.badRequest(`Waypoint with id : ${id} does not exist`)
    }

    // Retourner la réponse avec les données
    return response.ok({ data: waypoint })
  }
}
