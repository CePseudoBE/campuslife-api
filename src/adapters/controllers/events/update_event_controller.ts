import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { UpdateEventUseCase } from '#domain/use_cases/events/update_event_use_case'
import { UploadFilesService } from '#adapters/services/upload_files_service'

@inject()
export default class UpdateEventController {
  constructor(private updateEventUseCase: UpdateEventUseCase) {}

  public async handle({ params, request, response }: HttpContext) {
    try {
      const id = Number(params.id)
      const body = request.only([
        'title_en',
        'title_fr',
        'description_en',
        'description_fr',
        'image',
        'start',
        'end',
        'url',
        'slug',
        'waypointId',
        'addressId',
        'tags',
      ])

      const validatedData = await vine.validate({
        schema: ValidationService.getUpdateEventRules(),
        data: body,
      })
      const image = request.file('image')
      let imagePath: string | undefined
      if (image) {
        imagePath = await UploadFilesService.uploadIcon(
          image,
          'uploads/img',
          ['svg', 'png', 'jpg', 'tif'],
          '5mb'
        )
      }

      const updatedEvent = await this.updateEventUseCase.handle(id, validatedData, imagePath)

      return response.ok({ data: updatedEvent })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
