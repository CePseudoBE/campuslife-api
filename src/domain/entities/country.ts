export class Country {
  public id: number
  public name: string
  public iso: string
  public addresses?: string[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number,
    name: string,
    iso: string,
    createdAt: Date,
    updatedAt: Date,
    addresses?: string[]
  ) {
    this.id = id
    this.name = name
    this.iso = iso
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.addresses = addresses
  }
}
