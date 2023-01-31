import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({ }: HttpContextContract) {
    const users = await User.all()
    return users
  }

  public async store({ request, response }: HttpContextContract) {

    const newUserSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.required()
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.required(),
        rules.unique({ table: 'users', column: 'email' })
      ]),
      password: schema.string({ trim: true }, [
        rules.required(),
        rules.minLength(6)
      ]),
      admin: schema.boolean()
    })

    const userPayload = await request.validate({ schema: newUserSchema })

    const userCreate = await User.create(userPayload)

    return response.status(201).json({ userCreate })


  }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
