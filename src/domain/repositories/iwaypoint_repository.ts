import { Waypoint } from '#domain/entities/waypoint'
import { QueryParams } from '#domain/services/sorting_validation'

export abstract class IWaypointRepository {
  abstract create(waypoint: Waypoint): Promise<Waypoint>

  abstract findById(id: number, connected: boolean, includes?: string[]): Promise<Waypoint | null>

  abstract findBySlug(slug: string, includes?: string[]): Promise<Waypoint>

  abstract findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Waypoint[]>

  abstract update(waypoint: Waypoint): Promise<Waypoint>

  abstract delete(waypoint: Waypoint): Promise<null>

  abstract associateTags(idTags: number[], waypoint: Waypoint): Promise<Waypoint>
}
