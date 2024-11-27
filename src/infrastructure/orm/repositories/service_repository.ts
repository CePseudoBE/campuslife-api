import { inject } from '@adonisjs/core'
import { Service } from '#domain/entities/service'
import { ServiceMapper } from '#adapters/mappers/service_mapper'
import ServiceModel from '#infrastructure/orm/models/service_model'
import { DateTime } from 'luxon'
import { QueryParams } from '#domain/services/sorting_validation'
import { IServiceRepository } from '#domain/repositories/iservice_repository'

@inject()
export class ServiceRepository extends IServiceRepository {
  constructor() {
    super()
  }

  async create(service: Service): Promise<Service> {
    const serviceModel = ServiceMapper.toPersistence(service)
    await serviceModel.save()
    return ServiceMapper.toDomain(serviceModel)
  }

  async findById(id: number): Promise<Service> {
    const serviceModel = await ServiceModel.find(id)
    if (!serviceModel) {
      throw new Error(`NotFound: Service with id ${id} not found`)
    }
    return ServiceMapper.toDomain(serviceModel)
  }

  async findAll({ page, limit, order, column }: QueryParams): Promise<Service[]> {
    const query = ServiceModel.query()

    query.whereNull('deleted_at')

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    const serviceModels = await query.exec()
    return serviceModels.map((serviceModel) => ServiceMapper.toDomain(serviceModel))
  }

  async update(service: Service): Promise<Service> {
    if (!service.id) {
      throw new Error('NotFound: Service not found')
    }

    const serviceModel = await ServiceModel.query()
      .whereNull('deleted_at')
      .andWhere('id', service.id)
      .first()

    if (!serviceModel) {
      throw new Error('Deleted: Service deleted')
    }

    serviceModel.title = service.title
    serviceModel.description = service.description
    serviceModel.url = service.url
    serviceModel.icon = service.icon
    serviceModel.isActive = service.isActive

    await serviceModel.save()

    return ServiceMapper.toDomain(serviceModel)
  }

  async delete(service: Service): Promise<null> {
    if (!service.id) {
      throw new Error('NotFound: Service not found')
    }

    const serviceModel = await ServiceModel.query()
      .whereNull('deleted_at')
      .andWhere('id', service.id)
      .first()

    if (!serviceModel) {
      throw new Error('AlreadyDeleted: Service already deleted')
    }

    serviceModel.deletedAt = DateTime.local()

    await serviceModel.save()
    return null
  }
}
