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
      throw new Error(`InvalidIncludes: ${invalidIncludes.join(', ')}`)
    }

    return validIncludes
  }
  public static getAddressRules() {
    return vine.object({
      street: vine.string().trim().minLength(3).maxLength(100),
      num: vine.string().trim().minLength(1).maxLength(10),
      complement: vine.string().trim().maxLength(50).optional(),
      zip: vine.string().trim().minLength(3).maxLength(10),
      city: vine.string().trim().minLength(2).maxLength(50),
      country_id: vine.number().positive(),
    })
  }

  public static getAddressUpdateRules() {
    return vine.object({
      street: vine.string().trim().minLength(3).maxLength(100).optional(),
      num: vine.string().trim().minLength(1).maxLength(10).optional(),
      complement: vine.string().trim().maxLength(50).optional(),
      zip: vine.string().trim().minLength(3).maxLength(10).optional(),
      city: vine.string().trim().minLength(2).maxLength(50).optional(),
      country_id: vine.number().positive().optional(),
    })
  }

  public static getServiceRules() {
    return vine.object({
      title_en: vine.string().minLength(3).maxLength(50),
      title_fr: vine.string().minLength(3).maxLength(50),
      description_en: vine.string().minLength(5).maxLength(150),
      description_fr: vine.string().minLength(5).maxLength(150),
      url: vine.string(),
      icon: vine
        .file({
          size: '2mb',
          extnames: ['svg'],
        })
        .optional(),
      isActive: vine.boolean(),
    })
  }
  public static getUpdateServiceRules() {
    return vine.object({
      title_en: vine.string().minLength(3).maxLength(50).optional(),
      title_fr: vine.string().minLength(3).maxLength(50).optional(),
      description_en: vine.string().minLength(5).maxLength(150).optional(),
      description_fr: vine.string().minLength(5).maxLength(150).optional(),
      url: vine.string().optional(),
      icon: vine
        .file({
          size: '2mb',
          extnames: ['svg'],
        })
        .optional(),
      isActive: vine.boolean().optional(),
    })
  }

  public static getEventRules() {
    return vine.object({
      title_en: vine.string().minLength(3).maxLength(50),
      title_fr: vine.string().minLength(3).maxLength(50),
      description_en: vine.string().minLength(5).maxLength(150),
      description_fr: vine.string().minLength(5).maxLength(150),
      image: vine
        .file({
          size: '5mb',
          extnames: ['svg', 'png', 'jpg', 'tif'],
        })
        .optional(),
      start: vine.string(),
      end: vine.string(),
      url: vine.string(),
      slug: vine.string().optional(),
      waypoint: this.getWaypointRules(),
      userId: vine.number(),
      address: this.getAddressRules(),
      tags: vine.array(vine.number()).optional(),
    })
  }
  public static getUpdateEventRules() {
    return vine.object({
      title_en: vine.string().minLength(3).maxLength(50).optional(),
      title_fr: vine.string().minLength(3).maxLength(50).optional(),
      description_en: vine.string().minLength(5).maxLength(150).optional(),
      description_fr: vine.string().minLength(5).maxLength(150).optional(),
      image: vine
        .file({
          size: '5mb',
          extnames: ['svg', 'png', 'jpg', 'tif'],
        })
        .optional(),
      start: vine.string().optional(),
      end: vine.string().optional(),
      url: vine.string().optional(),
      slug: vine.string().optional(),
      waypoint: this.getWaypointRules().optional(),
      userId: vine.number().optional(),
      address: this.getAddressRules().optional(),
      tags: vine.array(vine.number()).optional(),
    })
  }
}
