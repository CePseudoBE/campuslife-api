import { Report } from '#domain/entities/report'
import ReportModel from '#infrastructure/orm/models/report_model'

export class ReportMapper {
  static toPersistence(report: Report): ReportModel {
    const reportModel = new ReportModel()
    reportModel.id = report.id
    reportModel.sessionId = report.sessionId
    reportModel.deviceId = report.deviceId
    reportModel.message = report.message
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
