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

  async create(waypoint: Waypoint): Promise<Waypoint> {
    const waypointModel = WaypointMapper.toPersistence(waypoint)
    await waypointModel.save()
    return WaypointMapper.toDomain(waypointModel)
  }

  async findAll(): Promise<Waypoint[]> {
    const waypointModels = await WaypointModel.all()
    return waypointModels.map(WaypointMapper.toDomain)
  }

  async findById(id: number): Promise<Waypoint | null> {
    const waypointModel = await WaypointModel.find(id)
    if (!waypointModel) return null
    await waypointModel.load('tags')
    await waypointModel.load('event')
    return WaypointMapper.toDomain(waypointModel)
  }
}
