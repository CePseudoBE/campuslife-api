import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { Waypoint } from '#domain/entities/waypoint'
import { WaypointMapper } from '#adapters/mappers/waypoint_mapper'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { inject } from '@adonisjs/core'

@inject()
export class WaypointRepository extends IWaypointRepository {
  constructor() {
    super()
  }

  async create(waypoint: Waypoint): Promise<void> {
    const waypointModel = WaypointMapper.toPersistence(waypoint)
    await waypointModel.save()
  }

  async findAll(): Promise<Waypoint[]> {
    const waypointModels = await WaypointModel.all() // Fetch all waypoints from the database
    return waypointModels.map(WaypointMapper.toDomain) // Map models to domain entities
  }

  async findById(id: number): Promise<Waypoint | null> {
    const waypointModel = await WaypointModel.find(id)
    if (!waypointModel) return null
    return WaypointMapper.toDomain(waypointModel)
  }
}
