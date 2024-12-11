import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateEventUseCase } from '#domain/use_cases/events/create_event_use_case'
import { UploadFilesService } from '#adapters/services/upload_files_service'

@inject()
export default class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  public async handle({ request, response }: HttpContext) {
    try {
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
        'waypoint',
        'userId',
        'address',
        'tags',
      ])

      try {
        const validatedData = await vine.validate({
          schema: ValidationService.getEventRules(),
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

        const event = await this.createEventUseCase.handle(validatedData, imagePath)

        return response.created({ data: event })
      } catch (err) {
        console.log(err)
      }
    } catch (error) {
      return response.badRequest({ messages: error.message })
    }
  }
}
