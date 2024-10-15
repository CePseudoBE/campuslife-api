import { inject } from '@adonisjs/core'
import { IReportRepository } from '#domain/repositories/ireport_repository'
import { Report } from '#domain/entities/report'

@inject()
export class CreateReportUseCase {
  constructor(private iReportRepository: IReportRepository) {}

  public async handle(data: {
    sessionId: string
    deviceId: string
    message: string
    contact?: string
  }): Promise<Report> {
    const report = new Report(
      null,
      data.sessionId,
      data.deviceId,
      data.message,
      new Date(),
      new Date(),
      null,
      data.contact
    )

    return await this.iReportRepository.create(report)
  }
}
