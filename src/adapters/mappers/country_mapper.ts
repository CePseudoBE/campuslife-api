import { Country } from '#domain/entities/country'
import CountryModel from '#infrastructure/orm/models/country_model'
import { AddressMapper } from './address_mapper.js'

export class CountryMapper {
  static toPersistence(country: Country): CountryModel {
    const countryModel = new CountryModel()

    countryModel.id = country.id
    countryModel.name = country.name
    countryModel.iso = country.iso

    return countryModel
  }

  static toDomain(countryModel: CountryModel): Country {
    let addresses
    if (countryModel.addresses) {
      addresses = countryModel.addresses.map((addressModel) => AddressMapper.toDomain(addressModel))
    }

    return new Country(
      countryModel.id,
      countryModel.name,
      countryModel.iso,
      countryModel.createdAt.toJSDate(),
      countryModel.updatedAt.toJSDate(),
      addresses
    )
  }
}
