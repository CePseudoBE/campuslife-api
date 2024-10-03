import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ValidLanguageMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const lang = ctx.params.lang

    if (!lang) {
      return ctx.response.badRequest({
        message: 'ParamsNotIncluded: Lang param should be included (/api/fr)',
      })
    }

    const validLanguages = ['fr', 'en']

    if (!validLanguages.includes(lang)) {
      return ctx.response.badRequest({
        message: 'InvalidLanguage: Supported languages are fr and en',
      })
    }

    await next()
  }
}
