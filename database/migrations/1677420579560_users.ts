import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('no_identification',180).primary()   //Identification
                                                        //The problem ¿Is it for unsigned?
      table.string('password', 180).notNullable()

      //Los que ya habian
      table.string('email', 255).notNullable().unique()
      table.string('kind_identification',180).notNullable()    //Tipo de identificacion
      table.string('names',180).notNullable()         //nombres
      table.string('last_names',180).notNullable()    //¿Los nombres van en snake case?. YES.
      //Perfil está en una tabla relacionada usuarios-perfils, las relaciones son de muchos a muchos.
      table.string('addres',180).notNullable()    //direccion
      table.string('municipio',180).notNullable()
      table.string('departamento',180).notNullable()
      table.string('remember_me_token').nullable()

      table.timestamps(true) //ERROR: no existe la columna «created_at» en la relación «users»
                             //¿Era por esto?
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
