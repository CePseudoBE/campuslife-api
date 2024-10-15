export class Log {
  public id: number | null
  public sessionId: string
  public userId: string
  public actionState: string
  public actionType: string
  public actionInfo: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number | null,
    sessionId: string,
    userId: string,
    actionState: string,
    actionType: string,
    actionInfo: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    if (!sessionId || sessionId.trim() === '') {
      throw new Error('Session ID is required')
    }

    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required')
    }

    if (!actionState || actionState.trim() === '') {
      throw new Error('Action state is required')
    }

    if (!actionType || actionType.trim() === '') {
      throw new Error('Action type is required')
    }

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
