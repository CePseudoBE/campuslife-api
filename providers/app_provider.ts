import { ApplicationService } from '@adonisjs/core/types'
import { WaypointRepository } from '#infrastructure/orm/repositories/waypoint_repository'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { ISlugService } from '#domain/services/islug_service'
import { SlugService } from '#infrastructure/services/slug_service'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { TagRepository } from '#infrastructure/orm/repositories/tag_repository'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { CollectionRepository } from '#infrastructure/orm/repositories/collection_repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    this.app.container.bind(IWaypointRepository, () => new WaypointRepository())
    this.app.container.bind(ISlugService, () => new SlugService())
    this.app.container.bind(ITagRepository, () => new TagRepository())
    this.app.container.bind(ICollectionRepository, () => new CollectionRepository())
  }
}
