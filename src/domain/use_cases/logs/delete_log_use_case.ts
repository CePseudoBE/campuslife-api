import { inject } from '@adonisjs/core'
import { ILogRepository } from '#domain/repositories/ilog_repository'

@inject()
export class DeleteLogUseCase {
  constructor(private iLogRepository: ILogRepository) {}

  public async handle(id: number): Promise<null> {
    const log = await this.iLogRepository.findById(id)
    return await this.iLogRepository.delete(log)
  }
}
