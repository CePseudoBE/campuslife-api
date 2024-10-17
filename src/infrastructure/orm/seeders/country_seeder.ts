import { BaseSeeder } from '@adonisjs/lucid/seeders'
import * as fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import { CreateCountryUseCase } from '#domain/use_cases/countries/create_country_use_case'
import { FindByIsoUseCase } from '#domain/use_cases/countries/find_by_iso_use_case'

export default class CountrySeeder extends BaseSeeder {
  public async run() {
    const createCountryUseCase = await app.container.make(CreateCountryUseCase)
    const findByIsoUseCase = await app.container.make(FindByIsoUseCase)
    const countriesFilePath = path.join(import.meta.dirname, './JSON/countries.json')
    const countriesData = fs.readFileSync(countriesFilePath, 'utf-8')
    const countries = JSON.parse(countriesData)

    for (const country of countries) {
      const lowerCaseCountry = {
        name: country.name.toLowerCase(),
        iso: country.ISO.toLowerCase(),
      }
      try {
        const noSeed = await findByIsoUseCase.handle(lowerCaseCountry.iso)
        console.log(`Not seedeed : ${noSeed.name}`)
      } catch (e) {
        const seed = await createCountryUseCase.handle({
          name: lowerCaseCountry.name,
          iso: lowerCaseCountry.iso,
        })
        console.log(`Seed : ${seed.name}`)
      }
    }
  }
}
