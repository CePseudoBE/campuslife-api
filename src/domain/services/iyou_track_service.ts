import { Report } from '#domain/entities/report'

export abstract class IYoutrackService {
  abstract createIssue(report: Report): Promise<void>
}
