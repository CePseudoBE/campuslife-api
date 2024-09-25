export class Log {
  public id: number
  public idSession: string
  public idUser: string
  public actionState: string
  public actionType: string
  public actionInfo: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    idSession: string,
    idUser: string,
    actionState: string,
    actionType: string,
    actionInfo: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.idSession = idSession
    this.idUser = idUser
    this.actionState = actionState
    this.actionType = actionType
    this.actionInfo = actionInfo
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
