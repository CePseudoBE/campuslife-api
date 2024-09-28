import { Address } from '#domain/entities/address'
import AddressModel from '#infrastructure/orm/models/address_model'

export class AddressMapper {
  static toPersistence(address: Address): AddressModel {
    const addressModel = new AddressModel()

    addressModel.id = address.id
    addressModel.street = address.street
    addressModel.num = address.num
    addressModel.complement = address.complement
    addressModel.zip = address.zip
    addressModel.city = address.city
    addressModel.idCountry = address.idCountry

    return addressModel
  }

  static toDomain(addressModel: AddressModel): Address {
    const createdAt = new Date(addressModel.createdAt.toJSDate())
    const updatedAt = new Date(addressModel.updatedAt.toJSDate())
    return new Address(
      addressModel.id,
      addressModel.street,
      addressModel.num,
      addressModel.zip,
      addressModel.city,
      addressModel.idCountry,
      createdAt,
      updatedAt,
      addressModel.complement
    )
  }
}
