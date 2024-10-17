import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { SeedStibsUseCase } from '#domain/use_cases/stib_shape/seed_stibs_use_case'
import app from '@adonisjs/core/services/app'

export default class StibShapeSeeder extends BaseSeeder {
  public async run() {
    const seedStibsUseCase = await app.container.make(SeedStibsUseCase)
    try {
      const stibs = await seedStibsUseCase.handle()
      console.log(stibs)
    } catch (e) {
      console.log(e)
    }
  }
}
