import { HttpContext } from '@adonisjs/core/http'
import { CreateWaypointUseCase } from '#domain/use_cases/waypoints/create_waypoint_use_case'
import { inject } from '@adonisjs/core'

@inject()
export default class CreateWaypointController {
  constructor(private createWaypointUseCase: CreateWaypointUseCase) {}

  handle({ request }: HttpContext) {
    const body = request.body()
    console.log(body)
    this.createWaypointUseCase.handle(body)
    return null
  }
}
