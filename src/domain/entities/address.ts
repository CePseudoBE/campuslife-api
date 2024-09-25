export class Address {
  public id: number
  public street: string
  public num: string
  public complement?: string
  public zip: string
  public city: string
  public idCountry: number
  public events?: string[]
  public country?: string
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    street: string,
    num: string,
    zip: string,
    city: string,
    idCountry: number,
    createdAt: Date,
    updatedAt: Date,
    complement?: string,
    events?: string[],
    country?: string
  ) {
    this.id = id
    this.street = street
    this.num = num
    this.complement = complement
    this.zip = zip
    this.city = city
    this.idCountry = idCountry
    this.events = events
    this.country = country
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
