import { Address } from '#domain/entities/address'
import AddressModel from '#infrastructure/orm/models/address_model'
import { EventMapper } from './event_mapper.js'
import { CountryMapper } from './country_mapper.js'

export class AddressMapper {
  static toPersistence(address: Address): AddressModel {
    const addressModel = new AddressModel()

    addressModel.street = address.street
    addressModel.num = address.num
    addressModel.complement = address.complement
    addressModel.zip = address.zip
    addressModel.city = address.city
    addressModel.countryId = address.countryId

    return addressModel
  }

  static toDomain(addressModel: AddressModel): Address {
    const address = new Address(
      addressModel.id,
      addressModel.street,
      addressModel.num,
      addressModel.zip,
      addressModel.city,
      addressModel.countryId,
      addressModel.createdAt.toJSDate(),
      addressModel.updatedAt.toJSDate(),
      addressModel.deletedAt ? addressModel.deletedAt.toJSDate() : null,
      addressModel.complement
    )

    if (addressModel.events) {
      address.events
        ? addressModel.events.map((eventModel) => EventMapper.toDomain(eventModel))
        : []
    }

    if (addressModel.country) {
      address.country ? CountryMapper.toDomain(addressModel.country) : undefined
    }

    return address
  }
}
