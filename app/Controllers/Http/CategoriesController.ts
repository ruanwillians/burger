import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {v4 as uuidv4} from 'uuid'
import Category from 'App/Models/Category'
import User from 'App/Models/User'
import  Application  from '@ioc:Adonis/Core/Application'

export default class CategoriesController {

  private validationOptions= {
    types: ['image'],
    size: '2mb'
  }

  public async index({}: HttpContextContract) {
      const categories = await Category.all()

      return categories
   }

  public async store({ request, response, auth }: HttpContextContract) {

    const { admin } = await User.findOrFail(auth.user?.id)

    if (!admin) {
      return response.status(401).json({ error: 'Você não pode criar um categoria' })
    }

    const categoryPayload = await request.body()

    const image = request.file('path', this.validationOptions)

    if(image){
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName
      })

      categoryPayload.path = imageName
    }

    const categorycreate = await Category.create(categoryPayload)

    return response.status(200).json({categorycreate})

  }

  public async show({ }: HttpContextContract) { }

  public async update({ request, response, auth}: HttpContextContract) {
    const { admin } = await User.findOrFail(auth.user?.id)

    if (!admin) {
      return response.status(401).json({ error: 'Você não pode criar um categoria' })
    }

    const id = request.param('id')

    const categorytExist = await Category.findOrFail(id)

    if(!categorytExist){
      response.status(401).json({error:'Produto não encontrado'})
    }

    const categoryPayload = await request.body()

    const image = request.file('path', this.validationOptions)

    if(image){
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName
      })

       categoryPayload.path = imageName
   }

   try {
    await categorytExist.merge(categoryPayload).save()
    response.status(200).json('produto alterado com sucesso')
  } catch (error) {
    response.status(400).json({error: error.message})
  }

  }

  public async destroy({ }: HttpContextContract) { }
}
