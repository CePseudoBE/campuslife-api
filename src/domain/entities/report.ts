export class Report {
  public id: number | null
  public sessionId: string
  public deviceId: string
  public message: string
  public contact?: string
  public createdAt: Date
  public updatedAt: Date
  public deletedAt: Date | null

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
    this.id = id
    this.sessionId = sessionId
    this.deviceId = deviceId
    this.message = message
    this.contact = contact
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
