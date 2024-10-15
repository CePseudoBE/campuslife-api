import { inject } from '@adonisjs/core'
import { IReportRepository } from '#domain/repositories/ireport_repository'

@inject()
export class DeleteCollectionUseCase {
  constructor(private iReportRepository: IReportRepository) {}

  public async handle(id: number): Promise<null> {
    const report = await this.iReportRepository.findById(id)
    report.delete()
    return await this.iReportRepository.delete(report)
  }
}
