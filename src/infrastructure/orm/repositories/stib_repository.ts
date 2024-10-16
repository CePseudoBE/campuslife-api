import { IStibRepository } from '#domain/repositories/istib_repository'
import { inject } from '@adonisjs/core'
import { StibShape } from '#domain/entities/stib_shape'
import { QueryParams } from '#domain/services/sorting_validation'
import { StibShapeMapper } from '#adapters/mappers/stib_shape_mapper'
import StibShapeModel from '#infrastructure/orm/models/stib_shape_model'

@inject()
export class StibRepository extends IStibRepository {
  constructor() {
    super()
  }

  async create(stibShape: StibShape): Promise<StibShape> {
    const stibShapeModel = StibShapeMapper.toPersistence(stibShape)
    await stibShapeModel.save()
    return StibShapeMapper.toDomain(stibShapeModel)
  }

  async delete(stibShape: StibShape): Promise<null> {
    if (!stibShape.id) {
      throw new Error('NotFound: Shape not found')
    }

    const stibShapeModel = await StibShapeModel.findOrFail(stibShape.id)

    await stibShapeModel.delete()

    return null
  }

  async findAll({ page, limit, order, column }: QueryParams): Promise<StibShape[]> {
    const query = StibShapeModel.query()

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    const shapeModels = await query.exec()

    return shapeModels.map((shape) => StibShapeMapper.toDomain(shape))
  }

  async findById(id: number): Promise<StibShape> {
    const shapeModel = await StibShapeModel.findOrFail(id)

    return StibShapeMapper.toDomain(shapeModel)
  }

  async findByName(name: string): Promise<StibShape> {
    const shapeModel = await StibShapeModel.findByOrFail('ligne', name)

    return StibShapeMapper.toDomain(shapeModel)
  }
}
