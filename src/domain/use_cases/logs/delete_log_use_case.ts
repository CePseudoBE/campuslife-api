import { inject } from '@adonisjs/core'
import { ILogRepository } from '#domain/repositories/ilog_repository'

@inject()
export class DeleteLogUseCase {
  constructor(private iLogRepository: ILogRepository) {}

  public async handle(id: number): Promise<null> {
    const log = await this.iLogRepository.findById(id)
    if (!log) {
      throw new Error(`NotFound: log with id ${id} not found`)
    }
    return await this.iLogRepository.delete(log)
  }
}
