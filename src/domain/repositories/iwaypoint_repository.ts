import { Waypoint } from '#domain/entities/waypoint'

export abstract class IWaypointRepository {
  abstract create(waypoint: Waypoint): Promise<void>

  abstract findById(id: number): Promise<Waypoint | null>

  abstract findAll(): Promise<Waypoint[]>
}
