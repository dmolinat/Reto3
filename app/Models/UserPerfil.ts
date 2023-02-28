import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserPerfil extends BaseModel {
  @column({ isPrimary: true }) public id: Number
  @column() public id_user: string
  @column() public status_perfil: Number
  @column() public fecha_inicio: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
