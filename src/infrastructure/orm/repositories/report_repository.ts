import { inject } from '@adonisjs/core'
import { IReportRepository } from '#domain/repositories/ireport_repository'
import { Report } from '#domain/entities/report'
import { QueryParams } from '#domain/services/sorting_validation'
import { ReportMapper } from '#adapters/mappers/report_mapper'
import ReportModel from '#infrastructure/orm/models/report_model'
import { DateTime } from 'luxon'

@inject()
export class ReportRepository extends IReportRepository {
  constructor() {
    super()
  }

  async create(report: Report): Promise<Report> {
    const reportModel = ReportMapper.toPersistence(report)
    await reportModel.save()
    return ReportMapper.toDomain(reportModel)
  }

  async delete(report: Report): Promise<null> {
    if (!report.id) {
      throw new Error('NotFound: Report not found')
    }

    const reportModel = await ReportModel.query()
      .whereNull('deleted_at')
      .andWhere('id', report.id)
      .first()

    if (!reportModel) {
      throw new Error('AlreadyDeleted: Report already deleted')
    }

    reportModel.deletedAt = DateTime.fromJSDate(report.deletedAt!)

    await reportModel.save()
    return null
  }

  async findAll({ page, limit, order, column }: QueryParams, deleted?: boolean): Promise<Report[]> {
    const query = ReportModel.query()

    if (!deleted) {
      query.whereNull('deleted_at')
    }

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    const reportModels = await query.exec()
    return reportModels.map((reportModel) => ReportMapper.toDomain(reportModel))
  }

  async findById(id: number, connected: boolean): Promise<Report> {
    const reportModel = await ReportModel.find(id)

    if (!reportModel) {
      throw new Error('NotFound: Report not found')
    }

    if (!connected) {
      if (reportModel.deletedAt) throw new Error('AlreadyDelete: Report deleted')
    }

    return ReportMapper.toDomain(reportModel)
  }
}
