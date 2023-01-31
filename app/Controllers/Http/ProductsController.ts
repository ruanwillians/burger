import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import User from 'App/Models/User'
import  Application  from '@ioc:Adonis/Core/Application'
import {v4 as uuidv4} from 'uuid'


export default class ProductsController {

  private validationOptions= {
    types: ['image'],
    size: '2mb'
  }

  public async index({}: HttpContextContract) {
    const products = await Product.query().preload('category')

    return products
  }


  public async store({request, response, auth}: HttpContextContract) {

    const { admin } = await User.findOrFail(auth.user?.id)

    if (!admin) {
      return response.status(401).json({ error: 'Você não pode criar um categoria' })
    }

    const productPayload = await request.body()

    const image = request.file('path', this.validationOptions)

    if(image){
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName
      })

      productPayload.path = imageName
    }

    const productCreate = await Product.create(productPayload)

    return response.status(201).json({ productCreate })

  }

  public async show({}: HttpContextContract) {}


  public async update({request, response, auth}: HttpContextContract) {
    const { admin } = await User.findOrFail(auth.user?.id)

    if (!admin) {
      return response.status(401).json({ error: 'Você não pode criar um categoria' })
    }

    const id = request.param('id')

    const productExist = await Product.findOrFail(id)

    if(!productExist){
      response.status(401).json({error:'Produto não encontrado'})
    }

    const productPayload = await request.body()

    const image = request.file('path', this.validationOptions)

    if(image){
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName
      })

      productPayload.path = imageName
    }

    try {
      await productExist.merge(productPayload).save()
      response.status(200).json('produto alterado com sucesso')
    } catch (error) {
      response.status(400).json({error: error.message})
    }

  }

  public async destroy({}: HttpContextContract) {}
}
