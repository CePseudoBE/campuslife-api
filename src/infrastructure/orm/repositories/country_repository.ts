import { ICountryRepository } from '#domain/repositories/icountry_repository'
import { inject } from '@adonisjs/core'
import { Country } from '#domain/entities/country'
import { QueryParams } from '#domain/services/sorting_validation'
import { CountryMapper } from '#adapters/mappers/country_mapper'
import CountryModel from '#infrastructure/orm/models/country_model'

@inject()
export class CountryRepository extends ICountryRepository {
  constructor() {
    super()
  }

  async create(country: Country): Promise<Country> {
    const countryModel = CountryMapper.toPersistence(country)
    await countryModel.save()
    return CountryMapper.toDomain(countryModel)
  }

  async delete(country: Country): Promise<null> {
    if (!country.id) {
      throw new Error('NotFound: Country not found')
    }

    const countryModel = await CountryModel.findOrFail(country.id)

    await countryModel.delete()

    return null
  }

  async findAll({ page, limit, order, column }: QueryParams): Promise<Country[]> {
    const query = CountryModel.query()

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    const countryModels = await query.exec()

    return countryModels.map((country) => CountryMapper.toDomain(country))
  }

  async findById(id: number): Promise<Country> {
    const countryModel = await CountryModel.findOrFail(id)

    return CountryMapper.toDomain(countryModel)
  }

  async findByIso(iso: string): Promise<Country> {
    const countryModel = await CountryModel.findByOrFail('iso', iso)

    return CountryMapper.toDomain(countryModel)
  }
}
