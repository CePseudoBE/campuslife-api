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
    }
  ): Promise<Waypoint | null> {
    const existingWaypoint = await this.iwaypointrepository.findById(id)
    if (!existingWaypoint) {
      return null
    }

    existingWaypoint.update(data)

    return await this.iwaypointrepository.update(existingWaypoint)
  }
}
