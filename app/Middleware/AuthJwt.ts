import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsuariosController from 'App/Controllers/Http/UsuariosController'

export default class AuthJwt {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authHeader=ctx.request.header('authorization')
    if(authHeader==undefined){
      return ctx.response.status(401).send({
        ERROR: `TOKEN don't found.`
      })
    }
    const token= authHeader
    try{
      const usuariosControl = new UsuariosController()
      usuariosControl.verificateToken(token)
      await next()
    } catch(e){
      ctx.response.status(500).json({ERROR: `token fail`})
    }
  }
}
