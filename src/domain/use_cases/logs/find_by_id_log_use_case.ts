import { inject } from '@adonisjs/core'
import { ILogRepository } from '#domain/repositories/ilog_repository'
import { Log } from '#domain/entities/log'

@inject()
export class FindByIdLogUseCase {
  constructor(private iLogRepository: ILogRepository) {}

  public async handle(data: { id: number }): Promise<Log | null> {
    return await this.iLogRepository.findById(data.id)
  }
}
