import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { WaypointTagsAssociateUseCase } from '#domain/use_cases/waypoints/waypoint_tags_associate_use_case'

@inject()
export default class WaypointsTagsAssociateController {
  constructor(private waypointTagsAssociateUseCase: WaypointTagsAssociateUseCase) {}

  async handle({ request, response, params }: HttpContext) {
    const body = request.only(['tags'])
    const id = params.id

    if (!id || Number.isNaN(id)) {
      return response.badRequest({ message: 'Bad ID provided (non existent or NaN)' })
    }

    const schema = vine.array(vine.number())

    try {
      const validatedData = await vine.validate({
        schema,
        data: body.tags,
      })

      const waypoint = await this.waypointTagsAssociateUseCase.handle({ id, tags: validatedData })

      return response.created({ data: waypoint })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
