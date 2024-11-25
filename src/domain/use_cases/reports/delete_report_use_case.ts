import { inject } from '@adonisjs/core'
import { IReportRepository } from '#domain/repositories/ireport_repository'

@inject()
export class DeleteReportUseCase {
  constructor(private iReportRepository: IReportRepository) {}

  public async handle(id: number): Promise<null> {
    const report = await this.iReportRepository.findById(id, false)
    if (!report) {
      throw new Error(`NotFound: report with id ${id} not found`)
    }
    report.delete()
    return await this.iReportRepository.delete(report)
  }
}
