import { ApplicationService } from '@adonisjs/core/types'
import { WaypointRepository } from '#infrastructure/orm/repositories/waypoint_repository'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { ISlugService } from '#domain/services/islug_service'
import { SlugService } from '#infrastructure/services/slug_service'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    this.app.container.bind(IWaypointRepository, () => new WaypointRepository())
    this.app.container.bind(ISlugService, () => new SlugService())
  }
}
