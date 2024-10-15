import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'

@inject()
export class FindByIdWaypointUseCase {
  constructor(private iwaypointrepository: IWaypointRepository) {}

  public async handle(data: {
    id: number
    connected: boolean
    includes?: string[]
  }): Promise<Waypoint | null> {
    return await this.iwaypointrepository.findById(data.id, data.connected, data.includes)
  }
}
