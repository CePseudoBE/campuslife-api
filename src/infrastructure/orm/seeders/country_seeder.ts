import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import fs from 'node:fs'
import path from 'node:path'

export default class CountrySeeder extends BaseSeeder {
  public async run() {
    //TODO : hexagonal architecture
    const filePath = path.join(import.meta.dirname, '/sql/countries.sql')

    const sql = fs.readFileSync(filePath, 'utf-8')

    await db.rawQuery(sql)
  }
}
