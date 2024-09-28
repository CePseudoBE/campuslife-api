import { Event } from '#domain/entities/event'

export class User {
  public id: number
  public email: string
  public firstName: string
  public lastName: string
  public role: string
  public events?: Event[]
  public createdAt: Date
  public updatedAt: Date | null

  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    createdAt: Date,
    updatedAt: Date | null,
    events?: Event[]
  ) {
    this.id = id
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.role = role
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.events = events
  }
}
