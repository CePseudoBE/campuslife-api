import { inject } from '@adonisjs/core'
import { IReportRepository } from '#domain/repositories/ireport_repository'

@inject()
export class DeleteReportUseCase {
  constructor(private iReportRepository: IReportRepository) {}

  public async handle(id: number): Promise<null> {
    const report = await this.iReportRepository.findById(id, false)
    report.delete()
    return await this.iReportRepository.delete(report)
  }
}
