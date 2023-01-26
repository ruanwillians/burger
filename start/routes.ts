import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', async ({ auth, request, response }) => {
    const email = request.input('email')
    const password = request.input('password')

    try {
        const token = await auth.use('api').attempt(email, password)
        const id = await auth.user?.id
        const username = await auth.user?.name
        return {
          token,
          id,
          username
        }
      } catch {
        return response.unauthorized('Invalid credentials')
      }
    })




  Route.group(() => {
    Route.get('/users', 'UsersController.index')
    Route.resource('/products', 'ProductsController').apiOnly()
    Route.resource('/categories', 'CategoriesController').apiOnly()
  }).middleware(['auth'])

  Route.post('/users', 'UsersController.store')
}).prefix('/api')


