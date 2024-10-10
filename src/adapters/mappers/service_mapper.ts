import { Service } from '#domain/entities/service'
import ServiceModel from '#infrastructure/orm/models/service_model'
import { DateTime } from 'luxon'

export class ServiceMapper {
  static toPersistence(service: Service): ServiceModel {
    const serviceModel = new ServiceModel()
    serviceModel.titleJson = service.titleJson
    serviceModel.descriptionJson = service.descriptionJson
    serviceModel.url = service.url
    serviceModel.icon = service.icon
    serviceModel.isActive = service.isActive
    serviceModel.deletedAt = service.deletedAt ? DateTime.fromJSDate(service.deletedAt) : null
    return serviceModel
  }

  static toDomain(serviceModel: ServiceModel): Service {
    return new Service(
      serviceModel.id,
      serviceModel.titleJson,
      serviceModel.descriptionJson,
      serviceModel.url,
      serviceModel.icon,
      serviceModel.isActive,
      serviceModel.createdAt.toJSDate(),
      serviceModel.updatedAt.toJSDate(),
      serviceModel.deletedAt ? serviceModel.deletedAt.toJSDate() : null
    )
  }
}
