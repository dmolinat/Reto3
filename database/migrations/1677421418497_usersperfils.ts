import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsuariosPerfiles extends BaseSchema {
  protected tableName = 'user_perfils'   //In postgres, use "" to many names.
                                         // table in snake case (?)

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('id_user').unique()      //Quit the .unique(), the relation it's many-many to profile
                                            //A user can have a profile, but a profile have many users.s
                                            //the relation it's has many. Image registers.
      table.integer('status_perfil')
      table.date('fecha_inicio').notNullable()
      table.foreign('id_user').references('no_identification').inTable('users').onDelete('cascade')    //Use inTable.
      table.foreign('status_perfil').references('id_perfil').inTable('perfils').onDelete('cascade')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
