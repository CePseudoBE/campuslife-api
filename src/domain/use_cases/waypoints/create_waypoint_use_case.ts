import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'

@inject()
export class CreateWaypointUseCase {
  constructor(private iwaypointrepository: IWaypointRepository) {}

  public async handle(data: {
    latitude: number
    longitude: number
    title_en?: string
    title_fr?: string
    description_en?: string
    description_fr?: string
    types: string
    pmr: boolean
    slug?: string
  }): Promise<Waypoint> {
    const title: Record<string, string> = {}
    const description: Record<string, string> = {}

    // Iterate through the data keys and build the title and description objects
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

    const titleJson = JSON.stringify(title)
    const descriptionJson = Object.keys(description).length
      ? JSON.stringify(description)
      : undefined

    const waypoint = new Waypoint(
      null,
      data.latitude,
      data.longitude,
      JSON.parse(titleJson),
      data.types,
      data.pmr,
      new Date(),
      new Date(),
      descriptionJson ? JSON.parse(descriptionJson) : undefined,
      data.slug
    )

    return await this.iwaypointrepository.create(waypoint)
  }
}
