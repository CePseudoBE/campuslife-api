import { IYoutrackService } from '#domain/services/iyou_track_service'
import { Report } from '#domain/entities/report'
import env from '#infrastructure/adonis/env'

export class YouTrackService implements IYoutrackService {
  public async createIssue(report: Report): Promise<void> {
    const bodyYT = {
      project: { id: '0-1' },
      summary: `Bug #${report.id}`,
      description: `${report.message}`,
      customFields: [
        { name: 'DeviceId', $type: 'TextIssueCustomField', value: { text: `${report.deviceId}` } },
        {
          name: 'SessionId',
          $type: 'TextIssueCustomField',
          value: { text: `${report.sessionId}` },
        },
        { name: 'Contact', $type: 'TextIssueCustomField', value: { text: `${report.contact}` } },
      ],
    }

    try {
      await fetch('https://campuslife.youtrack.cloud/api/issues', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${env.get('YOUTRACK_KEY')}`,
        },
        body: JSON.stringify(bodyYT),
      })
    } catch (error) {
      throw new Error('Failed to create issue on YouTrack')
    }
  }
}
