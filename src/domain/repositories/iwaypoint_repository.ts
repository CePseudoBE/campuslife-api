import { Waypoint } from '#domain/entities/waypoint'

export abstract class IWaypointRepository {
  abstract create(waypoint: Waypoint): Promise<Waypoint>

  abstract findById(id: number, includes?: string[]): Promise<Waypoint | null>

  abstract findAll(): Promise<Waypoint[]>
}
