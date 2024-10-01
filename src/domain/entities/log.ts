export class Log {
  public id: number
  public sessionId: string
  public userId: string
  public actionState: string
  public actionType: string
  public actionInfo: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    sessionId: string,
    userId: string,
    actionState: string,
    actionType: string,
    actionInfo: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.sessionId = sessionId
    this.userId = userId
    this.actionState = actionState
    this.actionType = actionType
    this.actionInfo = actionInfo
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
