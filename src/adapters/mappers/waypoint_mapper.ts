import { Waypoint } from '#domain/entities/waypoint'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'

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
    return new Waypoint(
      waypointModel.id,
      waypointModel.latitude,
      waypointModel.longitude,
      waypointModel.titleJson,
      waypointModel.types,
      waypointModel.pmr,
      waypointModel.createdAt,
      waypointModel.updatedAt,
      waypointModel.descriptionJson,
      waypointModel.slug
    )
  }
}
