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
      throw new Error('InvalidFormat: The street name must be provided and cannot be empty.')
    }

    if (!num || num.trim().length === 0) {
      throw new Error('InvalidFormat: The building number must be provided and cannot be empty.')
    }

    if (!zip || zip.trim().length === 0) {
      throw new Error('InvalidFormat: The postal code must be provided and cannot be empty.')
    }

    if (!city || city.trim().length === 0) {
      throw new Error('InvalidFormat: The city name must be provided and cannot be empty.')
    }

    if (countryId <= 0 || !Number.isInteger(countryId)) {
      throw new Error('InvalidFormat: The country ID must be a positive integer.')
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

  public delete(): void {
    this.deletedAt = new Date()
  }

  public update(data: {
    street?: string
    num?: string
    complement?: string
    zip?: string
    city?: string
    countryId?: number
    events?: Event[]
    country?: Country
  }): void {
    if (data.street) {
      if (data.street.trim().length === 0) {
        throw new Error('InvalidFormat: The street name cannot be empty.')
      }
      this.street = data.street
    }

    if (data.num) {
      if (data.num.trim().length === 0) {
        throw new Error('InvalidFormat: The building number cannot be empty.')
      }
      this.num = data.num
    }

    this.complement = data.complement ?? this.complement

    if (data.zip) {
      if (data.zip.trim().length === 0) {
        throw new Error('InvalidFormat: The postal code cannot be empty.')
      }
      this.zip = data.zip
    }
  }
}
