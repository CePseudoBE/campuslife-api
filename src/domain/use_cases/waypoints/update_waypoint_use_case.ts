import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'

@inject()
export class UpdateWaypointUseCase {
  constructor(private iwaypointrepository: IWaypointRepository) {}

  public async handle(
    id: number,
    data: {
      latitude?: number
      longitude?: number
      title_en?: string
      title_fr?: string
      description_en?: string
      description_fr?: string
      types?: string
      pmr?: boolean
      slug?: string
    }
  ): Promise<Waypoint | null> {
    const existingWaypoint = await this.iwaypointrepository.findById(id)
    if (!existingWaypoint) {
      return null
    }

    const title: Record<string, string> = {}
    const description: Record<string, string> = {}

    for (const key in data) {
      if (key.startsWith('title_')) {
        const lang = key.split('_')[1]
        title[lang] = (data as any)[key] // Cast 'data' as 'any' to handle dynamic indexing
      }
      if (key.startsWith('description_')) {
        const lang = key.split('_')[1]
        description[lang] = (data as any)[key] // Cast 'data' as 'any' to handle dynamic indexing
      }
    }

    const titleJson = Object.keys(title).length ? JSON.stringify(title) : existingWaypoint.title // Remplacer complètement le title
    const descriptionJson = Object.keys(description).length
      ? JSON.stringify(description)
      : existingWaypoint.description // Remplacer complètement la description

    existingWaypoint.latitude = data.latitude ?? existingWaypoint.latitude
    existingWaypoint.longitude = data.longitude ?? existingWaypoint.longitude
    existingWaypoint.title = typeof titleJson === 'string' ? JSON.parse(titleJson) : titleJson
    existingWaypoint.description =
      typeof descriptionJson === 'string' ? JSON.parse(descriptionJson) : descriptionJson
    existingWaypoint.types = data.types ?? existingWaypoint.types
    existingWaypoint.pmr = data.pmr ?? existingWaypoint.pmr
    existingWaypoint.slug = data.slug ?? existingWaypoint.slug
    existingWaypoint.updatedAt = new Date()

    return await this.iwaypointrepository.update(existingWaypoint)
  }
}
