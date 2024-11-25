import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'

@inject()
export class DeleteWaypointUseCase {
  constructor(private iwaypointrepository: IWaypointRepository) {}

  public async handle(id: number): Promise<null> {
    const waypoint = await this.iwaypointrepository.findById(id, false)
    if (!waypoint) {
      throw new Error(`NotFound: waypoint with id ${id} not found`)
    }
    waypoint.delete()
    return await this.iwaypointrepository.delete(waypoint)
  }
}
