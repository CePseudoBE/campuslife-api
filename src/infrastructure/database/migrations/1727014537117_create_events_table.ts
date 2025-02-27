import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.json('title').notNullable()
      table.json('description').notNullable()
      table.string('image', 255).notNullable()
      table.datetime('start').notNullable()
      table.datetime('end').notNullable()
      table.string('url').notNullable()
      table.string('slug').index('slug_event_index')
      table.integer('waypoint_id').unsigned().references('waypoints.id').onDelete('CASCADE')
      table.string('user_id').references('users.id').onDelete('CASCADE')
      table
        .integer('address_id')
        .unsigned()
        .references('addresses.id')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
