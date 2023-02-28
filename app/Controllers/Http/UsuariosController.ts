import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'
import Env from '@ioc:Adonis/Core/Env' //Use the .env
import jwt from 'jsonwebtoken'

const bcryptjs = require('bcryptjs')    //Library for encrypted.


export default class UsuariosController {

  //Register user
  public async registerusuario({request,response}: HttpContextContract){
    const {nombre, correo, contrasena} = request.all()
    const salt = bcryptjs.genSaltSync()   //Generate loops in the pass encryption. It's 10 by the default.
    const usuario = new Usuario();
    usuario.nombre= nombre;
    usuario.correo= correo;
    usuario.contrasena= bcryptjs.hashSync(contrasena, salt);    //password encrypted. hashSync

    await usuario.save()   //Using the model to save.
    response.status(200).json({OK: `User ${usuario.nombre} registred.`})
  }

  public async loginusuario({request,response}: HttpContextContract){
    const correo= request.input('correo')
    const contrasena = request.input('contrasena')
    try{
      //Exist correo (?)
      const usuario = await Usuario.findBy('correo',correo)
      if(!usuario){
        return response.status(400).json({ERROR: `email ${correo} don't found.`})
      }
      const validationPassword=bcryptjs.compareSync(contrasena,usuario.contrasena)
      if(!validationPassword){
        return response.status(400).json({ERROR: `password wrong.`})
      }

      //Create the payload.
      const payload = {
        "nombre": usuario.nombre,
        "id":usuario.id
      }
      const token:string = this.generateToken(payload);
      response.status(200).json({token, OK: `Login ${usuario.nombre} success`})
    }catch(e){
      response.status(500).json({ERROR: `Server error.`})
    }
  }
  public generateToken(payload: any):string{
    const opciones={
      expiresIn: "10 mins"
    }
    return jwt.sign(payload,Env.get('JWT_SECRET_KEY'),opciones)
  }

  public verificateToken(authHeader: string){
    let token = authHeader.split(' ')[1]
    token=jwt.verify(token, Env.get('JWT_SECRET_KEY', (error)=>{
      if(error){
        throw new Error("Token expirado");
      }

    }))
  }

}
