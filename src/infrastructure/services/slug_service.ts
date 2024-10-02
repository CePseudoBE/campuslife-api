import { ISlugService } from '#domain/services/islug_service'
import string from '@adonisjs/core/helpers/string'

export class SlugService extends ISlugService {
  generate(entire: string): string {
    return string.slug(entire)
  }
}
