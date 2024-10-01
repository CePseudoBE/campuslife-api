import { Country } from '#domain/entities/country'
import { Event } from '#domain/entities/event'

export class Address {
  public id: number
  public street: string
  public num: string
  public complement?: string
  public zip: string
  public city: string
  public countryId: number
  public events?: Event[]
  public country?: Country
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    street: string,
    num: string,
    zip: string,
    city: string,
    countryId: number,
    createdAt: Date,
    updatedAt: Date,
    complement?: string,
    events?: Event[],
    country?: Country
  ) {
    this.id = id
    this.street = street
    this.num = num
    this.complement = complement
    this.zip = zip
    this.city = city
    this.countryId = countryId
    this.events = events
    this.country = country
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
