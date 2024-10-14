import { Waypoint } from '#domain/entities/waypoint'

type WaypointDTOType = {
  id: number
  latitude: number
  longitude: number
  title: string | { [key: string]: string }
  description?: string | { [key: string]: string }
  types: string
  pmr: boolean
  slug?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  events?: any[]
  tags?: any[]
}

export class WaypointDTO {
  static toLanguages(
    waypoint: Waypoint,
    lang: 'fr' | 'en' | undefined,
    includes?: string[]
  ): WaypointDTOType {
    const dto: WaypointDTOType = {
      id: waypoint.id!,
      latitude: waypoint.latitude,
      longitude: waypoint.longitude,
      title: lang === undefined ? waypoint.title : waypoint.title[lang],
      description: waypoint.description
        ? lang === undefined
          ? waypoint.description
          : waypoint.description[lang]
        : undefined,
      types: waypoint.types,
      pmr: waypoint.pmr,
      slug: waypoint.slug,
      createdAt: waypoint.createdAt,
      updatedAt: waypoint.updatedAt,
      deletedAt: waypoint.deletedAt ?? null,
    }
    if (includes?.includes('events')) {
      dto.events = waypoint.events
    }

    if (includes?.includes('tags')) {
      dto.tags = waypoint.tags
    }

    return dto
  }
}
