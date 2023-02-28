import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Perfil from 'App/Models/Perfil';
import User from 'App/Models/User';
import UserPerfil from 'App/Models/UserPerfil';


export default class AuthController {
  //Register: agregar
  public async registerUser({request,auth,response}: HttpContextContract){
    const {no_identification,
            password,
            email,
            kind_identification,
            names,
            last_names,
            addres,
            municipio,
            departamento
          } = request.only(['no_identification',
            'password',
            'email',
            'kind_identification',
            'names',
            'last_names',
            'addres',
            'municipio',
            'departamento'])
    // console.log(`2. email: -> ${email}`) OK
    const user = new User();    //Create a user to use the model.
    user.no_identification=no_identification;
    user.password=password
    user.email=email
    user.kind_identification=kind_identification
    user.names=names
    user.last_names=last_names
    user.addres=addres
    user.municipio=municipio
    user.departamento=departamento
    try{
      // console.log(`1. user -> ${JSON.stringify(user)}`) OK
      await user.save()
      const number_profiles=(await Perfil.query().select('id_perfil').where({})).length
      const id_perfil=this.getRandomInt(number_profiles);      //0,1,2
      const foundUserPerfil = await this.getValidationProfileUser(no_identification, id_perfil)
      // console.log(`1. foundUserPerfil -> ${foundUserPerfil}`)  OK

      if(foundUserPerfil!=0){
        console.log(`User or profile dont found ${foundUserPerfil}`)
      }
      try{
        const user_perfil= new UserPerfil()
        user_perfil.id_user=no_identification
        user_perfil.status_perfil=id_perfil
        user_perfil.fecha_inicio=new Date(Date.now())
        await user_perfil.save()     //Create the realtion User-Profile automatically.
        //console.log(`user_profile -> ${user_profile.id_user} success.`) OK
      }catch(e){
        // console.log(`1. create user_profile -> ${e}`)
        return response.status(500).json({ERROR: `Profile save error -> ${e}`})
      }

      //Test for asign book and user: CHECK
      //
      //Get the ids book.
      /*const number_books=(await Book.query().select('id').where({})).length
      //console.log(`1. ids_books -> ${ids_books.length}`)    OK
      const id_book=this.getRandomInt(number_books)
      const user_book=new UserBook()
      user_book.id_user=no_identification;
      user_book.id_book=id_book;
      user_book.fecha_inicio=new Date(Date.now())
      try{
        user_book.save();
        console.log(`user_book saved.`)
      }catch(e){
        return response.status(500).json({ERROR: `user_book error save -> ${e}`})
      }*/

    }catch(e){
      return response.status(500).json({ERROR: `Server error -> ${e}`})
    }

    try{
      const token=await auth.use("api").login(user,{
        expiresIn: "10 days"
      });

      return {token, "msg": `User ${no_identification} registred success with profile random.`}

    }catch(e){
      console.log(`0. Error -> ${e}`)
    }

  }

  private async getValidationProfileUser(no_identification,id_perfil){
    let totalPerfil = await Perfil.query().where({"id_perfil":id_perfil})
    //console.log(`1. sizePerfil -> ${totalPerfil.length}`)
    if(totalPerfil.length==0){
      return 1;      //Profile don't found
    }
    let totalUser = await User.query().where({"no_identification":no_identification})
    if(totalUser.length==0){
      return 2;     //User don't dound
    }
    return 0      //All check
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


  public async loginUser({auth, request,response}: HttpContextContract){
    const no_identification = request.input('no_identification');
    const password = request.input('password');   //The pass is encripted, so you use the real pass.
    // console.log(`2. email -> ${no_identification} and password -> ${password}`)
    try{
      const token = await auth.use("api").attempt(no_identification,password,{    //Check -> config/auth.ts
        expiresIn: "60 mins"
      });

      //console.log(`1. token -> ${token.token}`) OK

      //Search the user to assign the token in remember_me_token.
      try{
        //const user_token = await ApiToken.query().select('user_id').where({"user_id": no_identification}).orderBy('expires_at')
        //console.log(`1. user_token -> ${JSON.stringify(user_token[0])}`)
        return {token,"msge": "usuario  logeado correctamente"}
      }catch(e){
        //console.log(`2. error -> ${e}`)
      }
    }catch(e){
      //console.log(`1. e -> ${e}`) OK
      return(response.unauthorized('Invalid credencials'))
    }
  }

}
