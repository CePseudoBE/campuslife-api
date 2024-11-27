import { Service } from '#domain/entities/service'
import { QueryParams } from '#domain/services/sorting_validation'
export abstract class IServiceRepository {
  abstract create(service: Service): Promise<Service>
  abstract findById(id: number): Promise<Service>
  abstract findAll(query: QueryParams): Promise<Service[]>
  abstract update(service: Service): Promise<Service>
  abstract delete(service: Service): Promise<null>
}
