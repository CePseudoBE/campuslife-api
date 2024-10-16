import { QueryParams } from '#domain/services/sorting_validation'
import { StibShape } from '#domain/entities/stib_shape'

export abstract class IStibRepository {
  abstract create(stibShape: StibShape): Promise<StibShape>

  abstract findById(id: number): Promise<StibShape>

  abstract findByName(id: number): Promise<StibShape>

  abstract findAll({ page, limit, order, column }: QueryParams): Promise<StibShape[]>

  abstract delete(stibShape: StibShape): Promise<null>
}
