import { ILogRepository } from '#domain/repositories/ilog_repository'
import { inject } from '@adonisjs/core'
import { Log } from '#domain/entities/log'
import { QueryParams } from '#domain/services/sorting_validation'
import { LogMapper } from '#adapters/mappers/log_mapper'
import LogModel from '#infrastructure/orm/models/log_model'

@inject()
export class LogRepository extends ILogRepository {
  constructor() {
    super()
  }

  async create(log: Log): Promise<Log> {
    const logModel = LogMapper.toPersistence(log)
    await logModel.save()
    return LogMapper.toDomain(logModel)
  }

  async delete(log: Log): Promise<null> {
    if (!log.id) {
      throw new Error('NotFound: Log not found')
    }

    const logModel = await LogModel.find(log.id)

    if (!logModel) {
      throw new Error('NotFound: Log not found')
    }
    await logModel.delete()

    return null
  }

  async findAll({ page, limit, order, column }: QueryParams): Promise<Log[]> {
    const query = LogModel.query()

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    const logModels = await query.exec()

    return logModels.map((log) => LogMapper.toDomain(log))
  }

  async findById(id: number): Promise<Log> {
    const query = LogModel.query().where('id', id)

    const logModel = await query.first()
    if (!logModel) {
      throw new Error('NotFound: Log not found')
    }

    return LogMapper.toDomain(logModel)
  }
}
