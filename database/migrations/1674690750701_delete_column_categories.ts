import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('category')
      table.integer('category_id').references('id').inTable('categories')
    })
  }
  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('category')
      table.dropColumn('category_id')
    })
  }

}



