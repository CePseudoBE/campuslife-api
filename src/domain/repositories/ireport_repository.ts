import { QueryParams } from '#domain/services/sorting_validation'
import { Report } from '#domain/entities/report'

export abstract class IReportRepository {
  abstract create(report: Report): Promise<Report>

  abstract findById(id: number, connected: boolean): Promise<Report>

  abstract findAll({ page, limit, order, column }: QueryParams): Promise<Report[]>

  abstract delete(report: Report): Promise<null>
}
