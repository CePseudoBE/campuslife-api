import { QueryParams } from '#domain/services/sorting_validation'
import { Log } from '#domain/entities/log'

export abstract class ILogRepository {
  abstract create(log: Log): Promise<Log>

  abstract findById(id: number): Promise<Log>

  abstract findAll({ page, limit, order, column }: QueryParams): Promise<Log[]>

  abstract delete(log: Log): Promise<null>
}
