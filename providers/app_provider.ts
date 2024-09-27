import { ApplicationService } from '@adonisjs/core/types'
import { WaypointRepository } from '#infrastructure/orm/repositories/waypoint_repository'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    this.app.container.bind(IWaypointRepository, () => new WaypointRepository())
  }
}
