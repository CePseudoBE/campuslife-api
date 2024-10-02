import { HttpContext } from '@adonisjs/core/http'
import { ValidationService } from '#adapters/services/validation_service'
import vine from '@vinejs/vine'
import { inject } from '@adonisjs/core'
import { UpdateWaypointUseCase } from '#domain/use_cases/waypoints/update_waypoint_use_case'

@inject()
export default class UpdateWaypointController {
  constructor(private updateWaypointUseCase: UpdateWaypointUseCase) {}

  async handle({ params, request, response }: HttpContext) {
    const body = request.only([
      'latitude',
      'longitude',
      'title_en',
      'title_fr',
      'description_en',
      'description_fr',
      'types',
      'pmr',
    ])

    const id = Number(params.id)

    if (Number.isNaN(id)) {
      return response.badRequest({ message: 'Invalid waypoint ID' })
    }

    const schema = ValidationService.getUpdateWaypointRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })
      const waypoint = await this.updateWaypointUseCase.handle(id, validatedData)

      if (!waypoint) {
        return response.notFound({ message: 'Waypoint not found' })
      }

      return response.ok(waypoint)
    } catch (err) {
      return response.badRequest({ message: err.message, details: err.messages || err })
    }
  }
}
