import { ILogRepository } from '#domain/repositories/ilog_repository'
import { inject } from '@adonisjs/core'
import { Log } from '#domain/entities/log'

@inject()
export class CreateLogUseCase {
  constructor(private iLogRepository: ILogRepository) {}

  public async handle(data: {
    sessionId: string
    userId: string
    actionState: string
    actionType: string
    actionInfo: string
  }) {
    const log = new Log(
      null,
      data.sessionId,
      data.userId,
      data.actionState,
      data.actionType,
      data.actionInfo,
      new Date(),
      new Date()
    )

    return await this.iLogRepository.create(log)
  }
}
