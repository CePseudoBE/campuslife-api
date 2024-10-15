import { inject } from '@adonisjs/core'
import { IReportRepository } from '#domain/repositories/ireport_repository'
import { Report } from '#domain/entities/report'
import { IYoutrackService } from '#domain/services/iyou_track_service'

@inject()
export class CreateReportUseCase {
  constructor(
    private iReportRepository: IReportRepository,
    private iYouTrackService: IYoutrackService
  ) {}

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

    const reportCreated = await this.iReportRepository.create(report)

    await this.iYouTrackService.createIssue(reportCreated)

    return reportCreated
  }
}
