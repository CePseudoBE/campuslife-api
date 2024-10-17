import { ApplicationService } from '@adonisjs/core/types'
import { WaypointRepository } from '#infrastructure/orm/repositories/waypoint_repository'
import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { ISlugService } from '#domain/services/islug_service'
import { SlugService } from '#infrastructure/services/slug_service'
import { ITagRepository } from '#domain/repositories/itag_repository'
import { TagRepository } from '#infrastructure/orm/repositories/tag_repository'
import { ICollectionRepository } from '#domain/repositories/icollection_repository'
import { CollectionRepository } from '#infrastructure/orm/repositories/collection_repository'
import { ILogRepository } from '#domain/repositories/ilog_repository'
import { LogRepository } from '#infrastructure/orm/repositories/log_repository'
import { IYoutrackService } from '#domain/services/iyou_track_service'
import { YouTrackService } from '#infrastructure/services/you_track_service'
import { IReportRepository } from '#domain/repositories/ireport_repository'
import { ReportRepository } from '#infrastructure/orm/repositories/report_repository'
import { IStibRepository } from '#domain/repositories/istib_repository'
import { StibRepository } from '#infrastructure/orm/repositories/stib_repository'
import { IStibShapeService } from '#domain/services/istib_shape_service'
import { StibShapeService } from '#adapters/services/stib_shape_service'
import { ICountryRepository } from '#domain/repositories/icountry_repository'
import { CountryRepository } from '#infrastructure/orm/repositories/country_repository'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    this.app.container.bind(IWaypointRepository, () => new WaypointRepository())
    this.app.container.bind(ISlugService, () => new SlugService())
    this.app.container.bind(ITagRepository, () => new TagRepository())
    this.app.container.bind(ICollectionRepository, () => new CollectionRepository())
    this.app.container.bind(ILogRepository, () => new LogRepository())
    this.app.container.bind(IYoutrackService, () => new YouTrackService())
    this.app.container.bind(IReportRepository, () => new ReportRepository())
    this.app.container.bind(IStibRepository, () => new StibRepository())
    this.app.container.bind(IStibShapeService, () => new StibShapeService())
    this.app.container.bind(ICountryRepository, () => new CountryRepository())
  }
}
