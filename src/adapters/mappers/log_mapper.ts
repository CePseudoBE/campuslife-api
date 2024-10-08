import { Log } from '#domain/entities/log'
import LogModel from '#infrastructure/orm/models/log_model'

export class LogMapper {
  static toPersistence(log: Log): LogModel {
    const logModel = new LogModel()
    logModel.sessionId = log.sessionId
    logModel.userId = log.userId
    logModel.actionState = log.actionState
    logModel.actionType = log.actionType
    logModel.actionInfo = log.actionInfo
    return logModel
  }

  static toDomain(logModel: LogModel): Log {
    return new Log(
      logModel.id,
      logModel.sessionId,
      logModel.userId,
      logModel.actionState,
      logModel.actionType,
      logModel.actionInfo,
      logModel.createdAt.toJSDate(),
      logModel.updatedAt.toJSDate()
    )
  }
}
