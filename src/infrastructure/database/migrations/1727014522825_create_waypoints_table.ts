import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'waypoints'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.json('title').notNullable()
      table.json('description').nullable()
      table.string('types').notNullable().defaultTo('default')
      table.boolean('pmr').notNullable().defaultTo(false)
      table.string('slug').index('slug_waypoint_index')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
