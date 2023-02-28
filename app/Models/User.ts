import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Perfil from './Perfil'
import Book from './Book'


export default class user extends BaseModel {
  @column({ isPrimary: true }) public no_identification: string
  @column() public email: string
  @column({ serializeAs: null })  public password: string

  @column() public kind_identification: string
  @column() public names: string
  @column() public last_names: string
  @column() public addres: string
  @column() public municipio: string
  @column() public departamento: string
  @column() public remember_me_token?: string


  @manyToMany(()=>Perfil,{
    localKey: 'no_identification',
    pivotForeignKey: 'id_user',
    relatedKey: 'id_perfil',
    pivotRelatedForeignKey: 'id_perfil',
    pivotTable: 'user_perfils',
  }) public user_perfil: ManyToMany<typeof Perfil>

  @manyToMany(()=>Book, {
    localKey: 'no_identification',
    pivotForeignKey: 'id_user',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'id_book',
    pivotTable: 'user_books',
  }) public user_book: ManyToMany<typeof Book>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: user) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

}
