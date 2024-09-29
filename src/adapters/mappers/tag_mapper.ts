import TagModel from '#infrastructure/orm/models/tag_model'
import { Tag } from '#domain/entities/tag'

export class TagMapper {
  static toPersistence(tag: Tag): TagModel {
    const tagModel = new TagModel()
    tagModel.titleJson = tag.titleJson
    tagModel.slugTitle = tag.slugTitle
    return tagModel
  }

  static toDomain(tagModel: TagModel): Tag {
    const createdAt = new Date(tagModel.createdAt.toJSDate())
    const updatedAt = new Date(tagModel.updatedAt.toJSDate())
    return new Tag(tagModel.id, tagModel.titleJson, tagModel.slugTitle, createdAt, updatedAt)
  }
}
