import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Books extends BaseSchema {
  protected tableName = 'books'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('tittle',200).notNullable();
      table.integer('author').unsigned().notNullable()

      table.string('editorial',150).notNullable()
      table.string('format',150).notNullable()      //Formato
      table.integer('no_pages').notNullable()
      //User identification estará en la tabla que relaciona users y books, ya que la relacion es de muchos a mucho
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
