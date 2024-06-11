import {object, string} from 'zod'

export const createSessionSchema = object({
  body: object({
    emailOrUsername: string({
      required_error: 'Email or Username is required'
    }),
    password: string({
      required_error: 'Password is required'
    })
  })
})