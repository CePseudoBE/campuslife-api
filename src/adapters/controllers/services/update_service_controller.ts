import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { UpdateServiceUseCase } from '#domain/use_cases/services/update_service_use_case'
import { UploadFilesService } from '#adapters/services/upload_files_service'

@inject()
export default class UpdateServiceController {
  constructor(private updateServiceUseCase: UpdateServiceUseCase) {}

  public async handle({ params, request, response }: HttpContext) {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return response.badRequest({ message: 'InvalidFormat: Invalid tag ID' })
    }
    const body = request.only([
      'title_en',
      'title_fr',
      'description_en',
      'description_fr',
      'url',
      'icon',
      'isActive',
    ])

    const schema = ValidationService.getUpdateServiceRules()

    try {
      const validatedData = await vine.validate({
        schema,
        data: body,
      })
      const icon = request.file('icon')
      let iconPath: string | undefined
      if (icon) {
        iconPath = await UploadFilesService.uploadIcon(icon)
      }
      const updatedAddress = await this.updateServiceUseCase.handle(id, validatedData, iconPath)

      return response.ok({ data: updatedAddress })
    } catch (error) {
      return response.badRequest({
        message: error.message,
        details: error.messages ? error.messages : [],
      })
    }
  }
}
