import { HttpContext } from '@adonisjs/core/http'
import { CreateWaypointUseCase } from '#domain/use_cases/waypoints/create_waypoint_use_case'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '../../services/validation_service.js'

@inject()
export default class CreateWaypointController {
  constructor(private createWaypointUseCase: CreateWaypointUseCase) {}

  async handle({ request, response }: HttpContext) {
    const body = request.only([
      'latitude',
      'longitude',
      'title_en',
      'title_fr',
      'description_en',
      'description_fr',
      'types',
      'pmr',
      'slug',
    ])

    const schema = ValidationService.getWaypointRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })

      const waypoint = await this.createWaypointUseCase.handle(validatedData)

      return response.created(waypoint)
    } catch (error) {
      return response.badRequest({
        message: "The data that has been send couldn't be treated",
        details: error.messages,
      })
    }
  }
}
