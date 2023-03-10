import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public user_id: string
  @column() public id_perfil: number
  @column() public name: string
  @column() public type: string
  @column() public token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
