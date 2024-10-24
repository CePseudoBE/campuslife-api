import { QueryParams } from '#domain/services/sorting_validation'
import { Address } from '#domain/entities/address'
import { Country } from '#domain/entities/country'

export abstract class IAddressRepository {
  abstract create(address: Address): Promise<Address>

  abstract findById(id: number): Promise<Address>

  abstract findAll({ page, limit, order, column }: QueryParams): Promise<Address[]>

  abstract update(address: Address): Promise<Address>

  abstract delete(address: Address): Promise<null>

  abstract associateCountry(country: Country, address: Address): Promise<Address>
}
