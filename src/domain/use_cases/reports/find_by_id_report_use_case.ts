import { inject } from '@adonisjs/core'
import { Report } from '#domain/entities/report'
import { IReportRepository } from '#domain/repositories/ireport_repository'

@inject()
export class FindByIdReportUseCase {
  constructor(private iReportRepository: IReportRepository) {}

  public async handle(data: { id: number; connected: boolean }): Promise<Report | null> {
    const report = await this.iReportRepository.findById(data.id, data.connected)

    if (!report) {
      throw new Error(`NotFound: report with id ${data.id} not found`)
    }
    return report
  }
}
