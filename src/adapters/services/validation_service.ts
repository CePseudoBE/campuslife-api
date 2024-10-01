import vine from '@vinejs/vine'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { HttpContext } from '@adonisjs/core/http'

export class ValidationService {
  public static getWaypointRules() {
    return vine.object({
      latitude: vine.number().range([-90, 90]),
      longitude: vine.number().range([-180, 180]),
      title_en: vine.string(),
      title_fr: vine.string().optional(),
      description_en: vine.string().optional(),
      description_fr: vine.string().optional(),
      types: vine.string(),
      pmr: vine.boolean(),
      slug: vine.string().optional(),
    })
  }

  static validateIncludes(includes: string[], model: typeof BaseModel): string[] {
    return includes.filter((relation) => {
      return model.$hasRelation(relation)
    })
  }

  public static async validateRequestAndIncludes(
    { request }: HttpContext,
    model: typeof BaseModel
  ): Promise<string[]> {
    let includes = request.qs().include ? request.qs().include.split(',') : []
    const validIncludes = ValidationService.validateIncludes(includes, model)

    // Si certains includes sont invalides, renvoyer une erreur
    if (validIncludes.length !== includes.length) {
      const invalidIncludes = includes.filter((rel: string) => !validIncludes.includes(rel))
      throw new Error(`Invalid includes: ${invalidIncludes.join(', ')}`)
    }

    return validIncludes
  }
}
