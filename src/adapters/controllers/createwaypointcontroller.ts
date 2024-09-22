import { HttpContext } from '@adonisjs/core/http'

export default class CreateWaypointController {
  handle({ request }: HttpContext) {
    const body = request.body()
    console.log(body)
  }
}
