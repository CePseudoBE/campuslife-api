import { Waypoint } from '#domain/entities/waypoint'

export abstract class IStibWaypointService {
  abstract fetchStib(): Promise<Waypoint[]>
}
