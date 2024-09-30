import { Waypoint } from '#domain/entities/waypoint'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { EventMapper } from '#adapters/mappers/event_mapper'
import { TagMapper } from '#adapters/mappers/tag_mapper'

//TODO relations when all mapper are done
export class WaypointMapper {
  static toPersistence(waypoint: Waypoint): WaypointModel {
    const waypointModel = new WaypointModel()
    waypointModel.latitude = waypoint.latitude
    waypointModel.longitude = waypoint.longitude
    waypointModel.titleJson = waypoint.title
    waypointModel.descriptionJson = waypoint.description
    waypointModel.types = waypoint.types
    waypointModel.pmr = waypoint.pmr
    waypointModel.slug = waypoint.slug
    return waypointModel
  }

  static toDomain(waypointModel: WaypointModel): Waypoint {
    const waypoint = new Waypoint(
      waypointModel.id,
      waypointModel.latitude,
      waypointModel.longitude,
      waypointModel.titleJson,
      waypointModel.types,
      waypointModel.pmr,
      waypointModel.createdAt.toJSDate(),
      waypointModel.updatedAt.toJSDate(),
      waypointModel.descriptionJson,
      waypointModel.slug
    )

    if (waypointModel.events) {
      waypoint.events = waypointModel.events.map((eventModel) => EventMapper.toDomain(eventModel))
    }

    if (waypointModel.tags) {
      waypoint.tags = waypointModel.tags.map((tagModel) => TagMapper.toDomain(tagModel))
    }

    return waypoint
  }
}
