import { Country } from '#domain/entities/country'
import { Event } from '#domain/entities/event'

export class Address {
  public id: number | null
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
  public deletedAt: Date | null

  constructor(
    id: number | null,
    street: string,
    num: string,
    zip: string,
    city: string,
    countryId: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    complement?: string,
    events?: Event[],
    country?: Country
  ) {
    if (!street || street.trim().length === 0) {
      throw new Error('InvalidStreetError: The street name must be provided and cannot be empty.')
    }

    if (!num || num.trim().length === 0) {
      throw new Error('InvalidNumError: The building number must be provided and cannot be empty.')
    }

    if (!zip || zip.trim().length === 0) {
      throw new Error('InvalidZipError: The postal code must be provided and cannot be empty.')
    }

    if (!city || city.trim().length === 0) {
      throw new Error('InvalidCityError: The city name must be provided and cannot be empty.')
    }

    if (countryId <= 0 || !Number.isInteger(countryId)) {
      throw new Error('InvalidCountryIdError: The country ID must be a positive integer.')
    }

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
    this.deletedAt = deletedAt
  }
}
