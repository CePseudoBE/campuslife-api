import { QueryParams } from '#domain/services/sorting_validation'
import { Country } from '#domain/entities/country'

export abstract class ICountryRepository {
  abstract create(country: Country): Promise<Country>

  abstract findById(id: number): Promise<Country>

  abstract findAll({ page, limit, order, column }: QueryParams): Promise<Country[]>

  abstract delete(country: Country): Promise<null>

  abstract findByIso(iso: string): Promise<Country>
}
