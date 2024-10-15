export class Report {
  public id: number | null
  public sessionId: string
  public deviceId: string
  public message: string
  public contact?: string
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

  public static allowedColumns: string[] = [
    'id',
    'sessionId',
    'deviceId',
    'message',
    'createdAt',
    'updatedAt',
    'contact',
  ]

  constructor(
    id: number | null,
    sessionId: string,
    deviceId: string,
    message: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    contact?: string
  ) {
    // Validate required fields
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('InvalidArgument: sessionId is required and cannot be empty.')
    }

    if (!deviceId || deviceId.trim().length === 0) {
      throw new Error('InvalidArgument: deviceId is required and cannot be empty.')
    }

    if (!message || message.trim().length === 0) {
      throw new Error('InvalidArgument: message is required and cannot be empty.')
    }

    this.id = id
    this.sessionId = sessionId
    this.deviceId = deviceId
    this.message = message
    this.contact = contact
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }

  public delete() {
    this.deletedAt = new Date()
  }
}
