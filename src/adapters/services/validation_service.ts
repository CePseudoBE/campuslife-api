import vine from '@vinejs/vine'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { HttpContext } from '@adonisjs/core/http'

export class ValidationService {
  public static getWaypointRules() {
    return vine.object({
      latitude: vine.number().range([-90, 90]),
      longitude: vine.number().range([-180, 180]),
      title_en: vine.string().minLength(3).maxLength(50),
      title_fr: vine.string().minLength(3).maxLength(50),
      description_en: vine.string().minLength(5).maxLength(150),
      description_fr: vine.string().minLength(5).maxLength(150),
      types: vine.string(),
      pmr: vine.boolean().optional(),
      tags: vine.array(vine.number()).optional(),
    })
  }

  public static getUpdateWaypointRules() {
    return vine.object({
      latitude: vine.number().range([-90, 90]).optional(),
      longitude: vine.number().range([-180, 180]).optional(),
      title_en: vine.string().optional(),
      title_fr: vine.string().optional(),
      description_en: vine.string().optional(),
      description_fr: vine.string().optional(),
      types: vine.string().optional(),
      pmr: vine.boolean().optional(),
    })
  }

  public static getTagRules() {
    return vine.object({
      title_en: vine.string().minLength(3).maxLength(50),
      title_fr: vine.string().minLength(3).maxLength(50),
      collections: vine.array(vine.number()).optional(),
    })
  }

  public static getUpdateTagRules() {
    return vine.object({
      title_en: vine.string().minLength(3).maxLength(50).optional(),
      title_fr: vine.string().minLength(3).maxLength(50).optional(),
    })
  }

  public static getCollectionRules() {
    return vine.object({
      name_en: vine.string().minLength(3).maxLength(50),
      name_fr: vine.string().minLength(3).maxLength(50),
      heroicons: vine.string(),
      tags: vine.array(vine.number()).optional(),
    })
  }

  public static getUpdateCollectionRules() {
    return vine.object({
      name_en: vine.string().minLength(3).maxLength(50).optional(),
      name_fr: vine.string().minLength(3).maxLength(50).optional(),
      heroicons: vine.string().optional(),
    })
  }

  public static getLogRules() {
    return vine.object({
      sessionId: vine.string(),
      userId: vine.string(),
      actionState: vine.string(),
      actionType: vine.string(),
      actionInfo: vine.string(),
    })
  }

  public static getReportRules() {
    return vine.object({
      sessionId: vine.string(),
      deviceId: vine.string(),
      message: vine.string(),
      contact: vine.string().optional(),
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
    if (validIncludes.length !== includes.length) {
      const invalidIncludes = includes.filter((rel: string) => !validIncludes.includes(rel))
      throw new Error(`Invalid includes: ${invalidIncludes.join(', ')}`)
    }

    return validIncludes
  }
}
