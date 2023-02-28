import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Book extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public tittle: string
  @column() public author: number
  @column() public editorial: string
  @column() public format: string
  @column() public no_pages: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
