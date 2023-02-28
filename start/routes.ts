/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
}).middleware("auth")

Route.group(()=>{
  //Agregar usuario.
  Route.group(()=>{
    Route.post('/register','AuthController.registerUser')
    Route.post('/login','AuthController.loginUser')
  }).prefix("public")

  Route.group(()=>{
    //Listar todo
    Route.get('/getUsers','UsersController.getUsers')
    //Buscar por el parametro ID
    Route.get('/getUserId/:no_identification','UsersController.userById')
    //Editar - actualizar
    Route.put('/updateUser','UsersController.updateUser')
    //Eliminar
    Route.delete('/deleteUser/:no_identification','UsersController.deleteUser')
  }).prefix("admin").middleware("auth")


  Route.group(()=>{
    //Agregar
    Route.post('/addProfile','PerfilsController.registerPerfils')
    //Listar todo
    Route.get('/getProfiles','PerfilsController.getPerfils')
    //Buscar por el parametro ID
    Route.get('/getProfileById/:id_perfil','PerfilsController.perfilById')
    //Editar - actualizar
    Route.put('/updateProfile','PerfilsController.updatePerfil')
    //Eliminar
    Route.delete('/deleteProfile/:id_perfil','PerfilsController.deletePerfil')
  }).prefix("admin").middleware("auth")


  Route.group(()=>{
    Route.get('/getBooks','BooksController.getBooks')
    Route.get('/getBook/:id', "BooksController.getBookById")
    Route.put('/updateBook/:id',"BooksController.updateBook")
    Route.post('/registerBook','BooksController.addBook')
    Route.delete('/deleteBook/:id','BooksController.deleteBook')

  }).prefix("librarian").middleware("auth")        //.middleware("auth");    //Las rutas que estén dentro de este grupo, estaran protegidas

}).prefix("api")
