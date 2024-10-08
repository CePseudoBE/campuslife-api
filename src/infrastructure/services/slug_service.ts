import { ISlugService } from '#domain/services/islug_service'
import string from '@adonisjs/core/helpers/string'

export class SlugService extends ISlugService {
  generate(entire: string): string {
    return string.slug(entire, { lower: true })
  }

  slugWithRandom(slug: string): string {
    return slug + string.random(2)
  }
}
