import { User } from '#domain/entities/user'
import UserModel from '#infrastructure/orm/models/user_model'

export class UserMapper {
  static toPersistence(user: User): UserModel {
    const userModel = new UserModel()
    userModel.email = user.email
    userModel.firstName = user.firstName
    userModel.lastName = user.lastName
    userModel.role = user.role
    return userModel
  }

  static toDomain(userModel: UserModel): User {
    return new User(
      userModel.id,
      userModel.email,
      userModel.firstName,
      userModel.lastName,
      userModel.role,
      userModel.createdAt.toJSDate(),
      userModel.updatedAt.toJSDate()
    )
  }
}
