import { Waypoint } from '#domain/entities/waypoint'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { inject } from '@adonisjs/core'

@inject()
export class FindSlugWaypointUseCase {
  constructor(private iWaypointRepository: IWaypointRepository) {}

  public async handle(data: { slug: string; includes?: string[] }): Promise<Waypoint | null> {
    const waypoint = await this.iWaypointRepository.findBySlug(data.slug, data.includes)
    if (!waypoint) {
      throw new Error(`NotFound: waypoint with slug ${data.slug} not found`)
    }
    return waypoint
  }
}
