import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsuariosPerfiles extends BaseSchema {
  protected tableName = 'user_books'   //In postgres, use "" to many names.
                                      //Name in snake case (?)

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('id_user')           //The unique() fail in relation many-many.
      table.integer('id_book')
      table.date('fecha_inicio').notNullable()
      table.foreign('id_user').references('no_identification').inTable('users').onDelete('cascade')    //Use inTable.
      table.foreign('id_book').references('id').inTable('books').onDelete('cascade')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
