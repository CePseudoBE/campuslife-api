import { inject } from '@adonisjs/core'
import { Report } from '#domain/entities/report'
import { IReportRepository } from '#domain/repositories/ireport_repository'

@inject()
export class FindByIdLogUseCase {
  constructor(private iReportRepository: IReportRepository) {}

  public async handle(data: { id: number; connected: boolean }): Promise<Report | null> {
    return await this.iReportRepository.findById(data.id, data.connected)
  }
}
