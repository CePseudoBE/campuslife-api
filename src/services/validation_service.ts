import vine from '@vinejs/vine'

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

  getWaypointRules() {}
}
