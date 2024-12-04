import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import { ValidationService } from '#adapters/services/validation_service'
import { CreateServiceUseCase } from '#domain/use_cases/services/create_service_use_case'
import { UploadFilesService } from '#adapters/services/upload_files_service'

@inject()
export default class CreateServiceController {
  constructor(private createServiceUseCase: CreateServiceUseCase) {}

  public async handle({ request, response }: HttpContext) {
    try {
      const body = request.only([
        'title_en',
        'title_fr',
        'description_en',
        'description_fr',
        'url',
        'isActive',
      ])

      const validatedData = await vine.validate({
        schema: ValidationService.getServiceRules(),
        data: body,
      })
      const icon = request.file('icon')
      let iconPath: string | undefined
      if (icon) {
        iconPath = await UploadFilesService.uploadIcon(icon)
      }
      const service = await this.createServiceUseCase.handle(validatedData, iconPath)

      return response.created({ data: service })
    } catch (error) {
      return response.badRequest({ messages: error.message })
    }
  }
}
