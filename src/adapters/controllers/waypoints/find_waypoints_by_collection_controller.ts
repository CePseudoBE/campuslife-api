import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FindWaypointsByCollectionUseCase } from '#domain/use_cases/waypoints/find_waypoints_by_collection_use_case'

@inject()
export default class FindWaypointsByCollectionController {
  constructor(private findWaypointsByCollectionUseCase: FindWaypointsByCollectionUseCase) {}

  public async handle({ params, response }: HttpContext) {
    try {
      const { id } = params

      const waypoints = await this.findWaypointsByCollectionUseCase.handle(Number(id))

      return response.ok({ data: waypoints })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
