import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiToken from 'App/Models/ApiToken';

import Perfil from "App/Models/Perfil";
import UserPerfil from 'App/Models/UserPerfil';

export default class PerfilsController {

  //Agregar perfiles
  public async registerPerfils({request,response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const {id_perfil,description} = request.only(['id_perfil','description'])
    const perfil=new Perfil()
    perfil.id_perfil=id_perfil;
    perfil.description=description;
    try{
      await perfil.save()
      response.status(200).json({OK: `perfil ${id_perfil} registred success.`})
    }catch(e){
      response.status(500).json({ERROR: `Server error -> ${e}`})
    }
  }

  //listar todos los perfiles.
  public async getPerfils({response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    return Perfil.all()
  }

  //Filtrar por id perfil.
  public async perfilById({request,response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const id_perfil = request.param('id_perfil');
    try{
      const perfil = await Perfil.query().where('id_perfil',id_perfil);
      return response.status(200).json({OK: perfil})
    }catch(e){
      response.status(500).json({ERROR: `Param profile Error -> ${e}`})
    }
  }

  //Editar perfil
  public async updatePerfil({request, response}: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const {id_perfil,description} = request.only(['id_perfil','description']);
    try{
      await Perfil.query().where('id_perfil', id_perfil).update({
        description: description
      });

        return response.status(200).json({OK: `profile ${id_perfil} data edited success.`})
    }catch(e){
      return response.status(500).json({ERROR: `update user error -> ${e}`})
    }
  }

  //Eliminar perfil
  public async deletePerfil({ request, response }: HttpContextContract){
    //Verify login.
    const user_token= await ApiToken.query().select('user_id').where({}).orderBy('created_at','desc')
    const user_profile = (await UserPerfil.query().where('id_user',user_token[0].user_id))[0]
    if(user_profile.status_perfil==2 || user_profile.status_perfil==1){   //Profile librarian or banned
      return response.status(401).json({E_UNAUTHORIZED_ACCESS: `Profile banned or Profile librarian.`})
    }

    const id_perfil = request.param('id_perfil');
    await Perfil.query().where('id_perfil',id_perfil).delete();
    return response.status(200).json({OK:`Perfil ${id_perfil}, deleted success`});
  }



}
