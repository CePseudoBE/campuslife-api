import { inject } from '@adonisjs/core'
import { ILogRepository } from '#domain/repositories/ilog_repository'
import { Log } from '#domain/entities/log'

@inject()
export class FindByIdLogUseCase {
  constructor(private iLogRepository: ILogRepository) {}

  public async handle(data: { id: number }): Promise<Log | null> {
    const log = await this.iLogRepository.findById(data.id)
    if (!log) {
      throw new Error(`NotFound: log with id ${data.id} not found`)
    }
    return log
  }
}
