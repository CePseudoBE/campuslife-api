import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { SeedStibsWaypointUseCase } from '#domain/use_cases/waypoints/seed_stib_use_case'
import app from '@adonisjs/core/services/app'

export default class StibWaypointSeeder extends BaseSeeder {
  public async run() {
    const seedStibsUseCase = await app.container.make(SeedStibsWaypointUseCase)
    try {
      const stibs = await seedStibsUseCase.handle()
      console.log(stibs)
    } catch (e) {
      console.log(e)
    }
  }
}
