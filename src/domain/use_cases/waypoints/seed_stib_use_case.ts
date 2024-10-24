import { inject } from '@adonisjs/core'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { IStibWaypointService } from '#domain/services/istib_waypoint_service'
import { Waypoint } from '#domain/entities/waypoint'

@inject()
export class SeedStibsWaypointUseCase {
  constructor(
    private iWaypointRepository: IWaypointRepository,
    private iStibWaypointService: IStibWaypointService
  ) {}

  public async handle(): Promise<Waypoint[]> {
    const stibs = await this.iStibWaypointService.fetchStib()

    const results: Waypoint[] = []

    for (const stib of stibs) {
      let stibFromRepo: Waypoint

      try {
        stibFromRepo = await this.iWaypointRepository.findBySlug(stib.slug!)
      } catch (error) {
        stibFromRepo = await this.iWaypointRepository.create(stib)
      }

      results.push(stibFromRepo)
    }

    return results
  }
}
