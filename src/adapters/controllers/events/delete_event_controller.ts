import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DeleteEventUseCase } from '#domain/use_cases/events/delete_event_use_case'

@inject()
export default class DeleteEventController {
  constructor(private deleteEventUseCase: DeleteEventUseCase) {}

  public async handle({ params, response }: HttpContext) {
    try {
      const { id } = params

      await this.deleteEventUseCase.handle(Number(id))

      return response.noContent()
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
