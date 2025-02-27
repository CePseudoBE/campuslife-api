import { IWaypointRepository } from '#domain/repositories/iwaypoint_repository'
import { Waypoint } from '#domain/entities/waypoint'
import { WaypointMapper } from '#adapters/mappers/waypoint_mapper'
import WaypointModel from '#infrastructure/orm/models/waypoint_model'
import { inject } from '@adonisjs/core'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { QueryParams } from '#domain/services/sorting_validation'
import { DateTime } from 'luxon'

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

  async findAll(
    { page, limit, order, column }: QueryParams,
    includes: string[],
    deleted?: boolean
  ): Promise<Waypoint[]> {
    const query = WaypointModel.query()

    if (!deleted) {
      query.whereNull('deleted_at')
    }

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    if (includes && includes.length > 0) {
      query.preload(includes[0] as ExtractModelRelations<WaypointModel>)
      for (let i = 1; i < includes.length; i++) {
        query.preload(includes[i] as ExtractModelRelations<WaypointModel>)
      }
    }

    const waypointModels = await query.exec()

    return waypointModels.map((model) => WaypointMapper.toDomain(model))
  }

  async findBySlug(slug: string, includes?: string[]): Promise<Waypoint> {
    const waypointModel = await WaypointModel.query().where('slug', slug).first()

    if (!waypointModel) throw new Error(`NotFound: Waypoint with the slug ${slug} not found`)

    if (includes && includes.length > 0) {
      for (const relation of includes) {
        await waypointModel.load(relation as ExtractModelRelations<WaypointModel>)
      }
    }

    return WaypointMapper.toDomain(waypointModel)
  }

  async findById(id: number, connected: boolean, includes?: string[]): Promise<Waypoint | null> {
    const waypointModel = await WaypointModel.find(id)
    if (!waypointModel) throw new Error(`NotFound: Waypoint with id ${id} not found`)

    if (!connected) {
      if (waypointModel.deletedAt) throw new Error('AlreadyDeleted: Tag deleted')
    }

    if (includes && includes.length > 0) {
      for (const relation of includes) {
        await waypointModel.load(relation as ExtractModelRelations<WaypointModel>)
      }
    }

    return WaypointMapper.toDomain(waypointModel)
  }

  async update(waypoint: Waypoint): Promise<Waypoint> {
    if (!waypoint.id) {
      throw new Error('NotFound: Waypoint not found')
    }
    const waypointModel = await WaypointModel.query()
      .whereNull('deleted_at')
      .andWhere('id', waypoint.id)
      .first()
    if (!waypointModel) {
      throw new Error('node AlreadyDeleted: Waypoint deleted')
    }

    waypointModel.latitude = waypoint.latitude
    waypointModel.longitude = waypoint.longitude
    waypointModel.title = waypoint.title
    waypointModel.description = waypoint.description
    waypointModel.types = waypoint.types
    waypointModel.pmr = waypoint.pmr
    waypointModel.slug = waypoint.slug

    await waypointModel.save()

    return WaypointMapper.toDomain(waypointModel)
  }

  async delete(waypoint: Waypoint): Promise<null> {
    if (!waypoint.id) {
      throw new Error('NotFound: Waypoint not found')
    }
    const waypointModel = await WaypointModel.query()
      .whereNull('deleted_at')
      .andWhere('id', waypoint.id)
      .first()

    if (!waypointModel) {
      throw new Error('AlreadyDeleted: Waypoint deleted')
    }

    waypointModel.deletedAt = DateTime.fromJSDate(waypoint.deletedAt!)

    await waypointModel.save()

    return null
  }

  async associateTags(idTags: number[], waypoint: Waypoint): Promise<Waypoint> {
    const waypointModel = await WaypointModel.find(waypoint.id)
    if (!waypointModel) {
      throw new Error('NotFound: Waypoint not found')
    }

    await waypointModel.related('tags').sync(idTags)

    await waypointModel.load('tags')

    return WaypointMapper.toDomain(waypointModel)
  }

  async findByTagIds(tagIds: number[]): Promise<Waypoint[]> {
    console.log('tagIds : ', tagIds)
    const waypointModel = await WaypointModel.query()
      .join('waypoints_tags', 'waypoints.id', 'waypoints_tags.waypoint_id')
      .whereIn('waypoints_tags.tag_id', tagIds)

    console.log('waypointModel', waypointModel)
    return waypointModel.map((model) => WaypointMapper.toDomain(model))
  }
}
