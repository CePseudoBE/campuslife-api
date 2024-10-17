import { Address } from '#domain/entities/address'

export class Country {
  public id: number | null
  public name: string
  public iso: string
  public addresses?: Address[]

  public static allowedColumns: string[] = ['id', 'name', 'iso']

  constructor(id: number | null, name: string, iso: string, addresses?: Address[]) {
    this.id = id
    this.name = name
    this.iso = iso
    this.addresses = addresses
  }
}
