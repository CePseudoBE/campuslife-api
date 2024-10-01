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
    const title: { [key: string]: string } = {}
    const description: { [key: string]: string } = {}

    if (data.title_en) title['en'] = data.title_en
    if (data.title_fr) title['fr'] = data.title_fr
    if (data.description_en) description['en'] = data.description_en
    if (data.description_fr) description['fr'] = data.description_fr

    const waypoint = new Waypoint(
      null,
      data.latitude,
      data.longitude,
      title,
      data.types,
      data.pmr,
      new Date(),
      new Date(),
      Object.keys(description).length > 0 ? description : undefined,
      data.slug
    )

    return await this.iwaypointrepository.create(waypoint)
  }
}
