import { IStibRepository } from '#domain/repositories/istib_repository'
import { inject } from '@adonisjs/core'
import { StibShape } from '#domain/entities/stib_shape'
import { QueryParams } from '#domain/services/sorting_validation'

@inject()
export class StibRepository extends IStibRepository {
  constructor() {
    super()
  }

  create(stibShape: StibShape): Promise<StibShape> {
    return Promise.resolve(undefined)
  }

  delete(stibShape: StibShape): Promise<null> {
    return Promise.resolve(null)
  }

  findAll({ page, limit, order, column }: QueryParams): Promise<StibShape[]> {
    return Promise.resolve([])
  }

  findById(id: number): Promise<StibShape> {
    return Promise.resolve(undefined)
  }

  findByName(id: number): Promise<StibShape> {
    return Promise.resolve(undefined)
  }
}
