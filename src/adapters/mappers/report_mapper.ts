import { Report } from '#domain/entities/report'
import ReportModel from '#infrastructure/orm/models/report_model'
import { DateTime } from 'luxon'

export class ReportMapper {
  static toPersistence(report: Report): ReportModel {
    const reportModel = new ReportModel()
    reportModel.sessionId = report.sessionId
    reportModel.deviceId = report.deviceId
    reportModel.message = report.message
    reportModel.deletedAt = report.deletedAt ? DateTime.fromJSDate(report.deletedAt) : null
    reportModel.contact = report.contact
    return reportModel
  }

  static toDomain(reportModel: ReportModel): Report {
    return new Report(
      reportModel.id,
      reportModel.sessionId,
      reportModel.deviceId,
      reportModel.message,
      reportModel.createdAt.toJSDate(),
      reportModel.updatedAt.toJSDate(),
      reportModel.deletedAt ? reportModel.deletedAt.toJSDate() : null,
      reportModel.contact
    )
  }
}
