
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
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


  public async store({request, response}: HttpContextContract) {

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


  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
