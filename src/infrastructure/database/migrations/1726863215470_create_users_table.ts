import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('email', 254).notNullable().unique()
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.string('role').notNullable().defaultTo('M')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
