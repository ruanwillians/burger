import Product from 'App/Models/Product';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import User from 'App/Models/User';

export default class OrdersController {
  public async index({ response }: HttpContextContract) {
    const orders = await Order.all()

    return response.json(orders)
  }

  public async store({ request, response, auth }: HttpContextContract) {


    const orderPayload = await request.body()

    //mapeando id's dos produtos do pedido
    const productId = orderPayload.pedido.products.map((product) => product.id)

    //fazendo requisição ao bd para pegar todas infos dos produtos que possuem os ids que estão no pedido
    const orderProducts = await (await Product.findMany(productId))

    //criando json para enviar ao bd
    const editedProduct = orderProducts.map(product => {

      //mapeando indices de cada produto que foi adicionado ao pedido
      const productIndex = orderPayload.pedido.products.findIndex(requestProduct => requestProduct.id === product.id)

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        url: product.path,
        quantity: orderPayload.pedido.products[productIndex].quantity
      }
      return newProduct
    })

    const order = {
      pedido: {
        user: {
          id: auth.user?.id,
          name: auth.user?.name
        },
        products: editedProduct,
      },
      status: 'Pedido realizado'
    }

    await Order.create(order)

    return response.status(200).json('Pedido feito com sucesso')
  }

  public async show({params }: HttpContextContract) {
    const order = await Order.findOrFail(params.id)
    return order
  }


  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const orderPayload = request.only(['status'])

    const order = await Order.findOrFail(id)

    try {
      await order.merge(orderPayload).save()
      response.status(200).json('Status alterado com sucesso')
    } catch (error) {
      response.status(400).json({error: error.message})
    }



    try {
      await order.merge({}).save()
      return response.status(200).json('Pedido alterado com sucesso')
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  public async destroy({ request, response, auth, params}: HttpContextContract) {
    const { admin } = await User.findOrFail(auth.user?.id)

    if (!admin) {
      return response.status(401).json({ error: 'Você não pode excluir um categoria' })
    }

    const order= await Order.findOrFail(params.id)

    try {
      await order.delete()
      response.status(200).json('Pedido deletado com sucesso')
    } catch (error) {
      response.status(400).json({error: error.message})
    }
  }
}
