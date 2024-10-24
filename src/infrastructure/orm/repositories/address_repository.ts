import { IAddressRepository } from '#domain/repositories/iaddress_repository'
import { inject } from '@adonisjs/core'
import { Address } from '#domain/entities/address'
import { QueryParams } from '#domain/services/sorting_validation'
import { AddressMapper } from '#adapters/mappers/address_mapper'
import AddressModel from '#infrastructure/orm/models/address_model'
import { DateTime } from 'luxon'
import { Country } from '#domain/entities/country'
import CountryModel from '#infrastructure/orm/models/country_model'

@inject()
export class AddressRepository extends IAddressRepository {
  constructor() {
    super()
  }

  async create(address: Address): Promise<Address> {
    const addressModel = AddressMapper.toPersistence(address)
    await addressModel.save()
    return AddressMapper.toDomain(addressModel)
  }

  async findById(id: number): Promise<Address> {
    const addressModel = await AddressModel.find(id)
    if (!addressModel) {
      throw new Error('NotFound: Address not found')
    }
    return AddressMapper.toDomain(addressModel)
  }

  async findAll({ page, limit, order, column }: QueryParams): Promise<Address[]> {
    const query = AddressModel.query()

    query.whereNull('deleted_at') // Soft delete handling

    if (page && limit) {
      await query.paginate(page, limit)
    }

    if (column && order) {
      query.orderBy(column, order)
    }

    const addressModels = await query.exec()
    return addressModels.map((addressModel) => AddressMapper.toDomain(addressModel))
  }

  async update(address: Address): Promise<Address> {
    if (!address.id) {
      throw new Error('NotFound: Address not found')
    }

    const addressModel = await AddressModel.query()
      .whereNull('deleted_at')
      .andWhere('id', address.id)
      .first()

    if (!addressModel) {
      throw new Error('Deleted: Address deleted')
    }

    addressModel.street = address.street
    addressModel.num = address.num
    addressModel.complement = address.complement
    addressModel.zip = address.zip
    addressModel.city = address.city

    await addressModel.save()

    return AddressMapper.toDomain(addressModel)
  }

  async delete(address: Address): Promise<null> {
    if (!address.id) {
      throw new Error('NotFound: Address not found')
    }

    const addressModel = await AddressModel.query()
      .whereNull('deleted_at')
      .andWhere('id', address.id)
      .first()

    if (!addressModel) {
      throw new Error('AlreadyDeleted: Address already deleted')
    }

    addressModel.deletedAt = DateTime.local()

    await addressModel.save()
    return null
  }

  async associateCountry(country: Country, address: Address): Promise<Address> {
    const addressModel = await AddressModel.find(address.id)
    if (!addressModel) {
      throw new Error('NotFound: Address not found')
    }

    const countryModel = await CountryModel.find(country.id)

    if (!countryModel) {
      throw new Error('NotFound: Country not found')
    }

    await addressModel.related('country').associate(countryModel)

    await addressModel.load('country')

    return AddressMapper.toDomain(addressModel)
  }
}
