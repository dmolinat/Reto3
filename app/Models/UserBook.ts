import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserBook extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public id_user: string
  @column() public id_book: number
  @column() public fecha_inicio: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
