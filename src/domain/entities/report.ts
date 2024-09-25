export class Report {
  public id: number
  public sessionId: string
  public deviceId: string
  public message: string
  public contact?: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    sessionId: string,
    deviceId: string,
    message: string,
    createdAt: Date,
    updatedAt: Date,
    contact?: string
  ) {
    this.id = id
    this.sessionId = sessionId
    this.deviceId = deviceId
    this.message = message
    this.contact = contact
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
