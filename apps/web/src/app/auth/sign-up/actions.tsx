'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please enter a valid full name',
    }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords must match',
    path: ['password_confirmation'],
  })

export const signUpAction = async (data: FormData) => {
  const formDataValidationResult = signUpSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!formDataValidationResult.success) {
    const errors = formDataValidationResult.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = formDataValidationResult.data

  try {
    await signUp({
      name: String(name),
      email: String(email),
      password: String(password),
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }
    console.error(error)
    return {
      success: false,
      message: 'An unknown error occurred',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
