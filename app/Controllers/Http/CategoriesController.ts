import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const newCategorySchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.required(),
        rules.unique({table: 'categories', column: 'name'})
      ]),
  })

  const categoryPayload = await request.validate({schema: newCategorySchema})

  const categorycreate = await Category.create(categoryPayload)

  return response.status(200).json(categorycreate)
  }

  public async show({}: HttpContextContract) {}


  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
