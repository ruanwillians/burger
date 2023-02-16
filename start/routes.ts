import  Application  from '@ioc:Adonis/Core/Application';
import Route from '@ioc:Adonis/Core/Route'
import Drive from '@ioc:Adonis/Core/Drive'


Route.group(() => {
  Route.post('/login', async ({ auth, request, response }) => {
    const email = request.input('email')
    const password = request.input('password')

    try {
        const token = await auth.use('api').attempt(email, password)
        const id = await auth.user?.id
        const username = await auth.user?.name
        const admin = await auth.user?.admin
        return {
          token,
          id,
          username,
          admin
        }
      } catch {
        return response.unauthorized('Invalid credentials')
      }
    })

    Route.get('/uploads/:filename', async ({ params, response }) => {
      const filename = params.filename

      // Define o caminho completo do arquivo de imagem
      const imagePath = Application.publicPath(`images/${filename}`)

      // Verifica se o arquivo existe
      const exists = await Drive.exists(imagePath)

      // Retorna a imagem se ela existir
      if (exists) {
        return response.download(imagePath)
      }

      // Retorna um erro 404 se a imagem não existir
      return response.status(404).send('Imagem não encontrada')
    })

  Route.group(() => {
    Route.get('/users', 'UsersController.index')
    Route.post('/products', 'ProductsController.store')
    Route.delete('/products', 'ProductsController.destroy')
    Route.patch('/products/:id', 'ProductsController.update')
    Route.resource('/order', 'OrdersController').apiOnly()
    Route.post('/category', 'CategoriesController.store')
    Route.delete('/category', 'CategoriesController.destroy')
    Route.patch('/category', 'CategoriesController.update')

  }).middleware(['auth'])

  Route.post('/users', 'UsersController.store')
  Route.get('/products', 'ProductsController.index')
  Route.get('/products/:id', 'ProductsController.show')
  Route.get('/category', 'CategoriesController.index')
}).prefix('/api')


