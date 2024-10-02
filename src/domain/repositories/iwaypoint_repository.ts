import { Waypoint } from '#domain/entities/waypoint'
import { QueryParams } from '#domain/services/sorting_validation'

export abstract class IWaypointRepository {
  abstract create(waypoint: Waypoint): Promise<Waypoint>

  abstract findById(id: number, includes?: string[]): Promise<Waypoint | null>

  abstract findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[]
  ): Promise<Waypoint[]>

  abstract update(waypoint: Waypoint): Promise<Waypoint>

  abstract delete(waypoint: Waypoint): Promise<null>
}
