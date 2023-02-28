import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiToken from 'App/Models/ApiToken'
import Book from 'App/Models/Book'
import UserPerfil from 'App/Models/UserPerfil'

export default class BooksController {

  //Anadir el libro..
  public async addBook({request,response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
                                                        //get the lastLogin
    // console.log(`1. user_token -> ${JSON.stringify(user_token[0])}`) OK
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    // console.log(`1. user cacth -> ${JSON.stringify(user_profile)}`)
    if(user_profile.status_perfil==2){
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned.`})
    }

    const {tittle,author,editorial,format,no_pages} = request.all()
    const book = new Book()
    book.tittle = tittle
    book.author = author
    book.editorial=editorial
    book.format=format
    book.no_pages=no_pages

    try{
      await book.save()
      return response.status(200).json({mssg: `Se ha registado el libro ${book.tittle}`})
    }catch(e){
      response.status(500).json({SERVER_ERROR: `Server error -> ${e}`})
    }
  }

  //Get all books.
  public async getBooks({response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
                                                        //get the lastLogin
    // console.log(`1. user_token -> ${JSON.stringify(user_token[0])}`) OK
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    // console.log(`1. user cacth -> ${JSON.stringify(user_profile)}`)
    if(user_profile.status_perfil==2){
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned.`})
    }

    const books = await Book.all();
    return books
  }

  //Get a single book.
  public async getBookById({params, response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
                                                        //get the lastLogin
    // console.log(`1. user_token -> ${JSON.stringify(user_token[0])}`) OK
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    // console.log(`1. user cacth -> ${JSON.stringify(user_profile)}`)
    if(user_profile.status_perfil==2){
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned.`})
    }

    try{
      const book=await Book.find(params.id);
      if(!book){
        return(`Libro no existente`);
      }
      return response.status(200).json({OK: book})
    }catch(e){
      return response.status(500).json({error: `e -> ${e}`})
    }
  }

  //Update a book.
  public async updateBook({request, response, params}:HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
                                                        //get the lastLogin
    // console.log(`1. user_token -> ${JSON.stringify(user_token[0])}`) OK
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    // console.log(`1. user cacth -> ${JSON.stringify(user_profile)}`)
    if(user_profile.status_perfil==2){
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned.`})
    }

    const book = await Book.find(params.id)
    if(!book){
      return response.status(401).json({NOTFOUND: 'Libro no econtrado'})
    }
    const {tittle,author,editorial,format,no_pages} = request.all()
    book.tittle = tittle
    book.author = author
    book.editorial=editorial
    book.format=format
    book.no_pages=no_pages

    if(!(await book.save())){
      response.status(401).json({NOTUPDATE: 'No se puede actualizar'})
    }
    await book.save()
    return response.status(200).json({OK: `Libro ${params.id} actualizado.`})
  }

  //Eliminar.
  public async deleteBook({ request, response }: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
                                                        //get the lastLogin
    // console.log(`1. user_token -> ${JSON.stringify(user_token[0])}`) OK
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    // console.log(`1. user cacth -> ${JSON.stringify(user_profile)}`)
    if(user_profile.status_perfil==2){
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned.`})
    }

    const id = request.param('id');
    await Book.query().where('id',id).delete();
    return response.status(200).json({OK:`Libro ${id}, deleted success`});
  }
}
