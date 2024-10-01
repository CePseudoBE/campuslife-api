import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { Waypoint } from '#domain/entities/waypoint'
import { WaypointMapper } from '#adapters/mappers/waypoint_mapper'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { inject } from '@adonisjs/core'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'

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

  async findById(id: number, includes?: string[]): Promise<Waypoint | null> {
    const waypointModel = await WaypointModel.find(id)
    if (!waypointModel) return null

    if (includes && includes.length > 0) {
      for (const relation of includes) {
        await waypointModel.load(relation as ExtractModelRelations<WaypointModel>)
      }
    }

    return WaypointMapper.toDomain(waypointModel)
  }

  async update(waypoint: Waypoint): Promise<Waypoint> {
    const waypointModel = await WaypointModel.find(waypoint.id)
    if (!waypointModel) {
      throw new Error('Waypoint not found')
    }

    // Update the fields in the persistence model
    waypointModel.latitude = waypoint.latitude
    waypointModel.longitude = waypoint.longitude
    waypointModel.titleJson = waypoint.title
    waypointModel.descriptionJson = waypoint.description
    waypointModel.types = waypoint.types
    waypointModel.pmr = waypoint.pmr
    waypointModel.slug = waypoint.slug

    await waypointModel.save()

    return WaypointMapper.toDomain(waypointModel)
  }
}
