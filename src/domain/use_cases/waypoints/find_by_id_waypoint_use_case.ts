import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'

@inject()
export class FindByIdWaypointUseCase {
  constructor(private iwaypointrepository: IWaypointRepository) {}

  public async handle(data: { id: number }): Promise<Waypoint | null> {
    const waypoint = await this.iwaypointrepository.findById(data.id)

    return waypoint
  }
}
