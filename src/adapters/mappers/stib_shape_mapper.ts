import { StibShape } from '#domain/entities/stib_shape'
import StibShapeModel from '#infrastructure/orm/models/stib_shape_model'

export class StibShapeMapper {
  static toPersistence(stibShape: StibShape): StibShapeModel {
    const stibShapeModel = new StibShapeModel()
    stibShapeModel.ligne = stibShape.ligne
    stibShapeModel.colorHex = stibShape.colorHex
    return stibShapeModel
  }

  static toDomain(stibShapeModel: StibShapeModel): StibShape {
    return new StibShape(
      stibShapeModel.id,
      stibShapeModel.ligne,
      stibShapeModel.colorHex,
      stibShapeModel.createdAt.toJSDate(),
      stibShapeModel.updatedAt.toJSDate()
    )
  }
}
