import { Address } from '#domain/entities/address'

export class Country {
  public id: number | null
  public name: string
  public iso: string
  public addresses?: Address[]
  public createdAt: Date
  public updatedAt: Date

  constructor(
    id: number | null,
    name: string,
    iso: string,
    createdAt: Date,
    updatedAt: Date,
    addresses?: Address[]
  ) {
    this.id = id
    this.name = name
    this.iso = iso
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.addresses = addresses
  }
}
