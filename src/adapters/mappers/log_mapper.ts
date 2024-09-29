import { Log } from '#domain/entities/log'
import LogModel from '#infrastructure/orm/models/log_model'

export class LogMapper {
  static toPersistence(log: Log): LogModel {
    const logModel = new LogModel()
    logModel.id = log.id
    logModel.idSession = log.idSession
    logModel.idUser = log.idUser
    logModel.actionState = log.actionState
    logModel.actionType = log.actionType
    logModel.actionInfo = log.actionInfo
    return logModel
  }

  static toDomain(logModel: LogModel): Log {
    return new Log(
      logModel.id,
      logModel.idSession,
      logModel.idUser,
      logModel.actionState,
      logModel.actionType,
      logModel.actionInfo,
      logModel.createdAt.toJSDate(),
      logModel.updatedAt.toJSDate()
    )
  }
}
