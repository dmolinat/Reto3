import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiToken from 'App/Models/ApiToken';
import User from "App/Models/User";
import UserPerfil from 'App/Models/UserPerfil';

export default class UsersController {
  //Agregar.
  //Los metodos agregar estan en AuthController.

  //listar todo.
  public async getUsers({response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }
    return User.all()
  }

  //Filtrar por documento
  public async userById({request,response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const no_identification = request.param('no_identification');
    try{
      const users = await User.query().where('no_identification',no_identification);
      return response.status(200).json({OK: users})
    }catch(e){
      response.status(500).json({ERROR: `Param user Error -> ${e}`})
    }
  }

  //Editar usuario
  public async updateUser({request, response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const {no_identification, password, email, kind_identification, names, last_names, addres, municipio, departamento} = request.all();
    try{
      //console.log(`1. no_identification -> ${no_identification}`)
      await User.query().where('no_identification', no_identification).update({
        password: password,
        email: email,
        kind_identification: kind_identification,
        names: names,
        last_names: last_names,
        addres: addres,
        municipio: municipio,
        departamento: departamento});

        return response.status(200).json({OK: `user ${no_identification} data edited success.`})
    }catch(e){
      return response.status(500).json({ERROR: `update user error -> ${e}`})
    }
  }

  //Eliminar usuario
  public async deleteUser({ request, response }: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const no_identification = request.param('no_identification');
    await User.query().where('no_identification',no_identification).delete();
    return response.status(200).json({OK:`Usuario ${no_identification}, deleted success`});
  }


}
