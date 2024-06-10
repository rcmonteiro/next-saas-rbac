'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export const signInWithEmailAndPassword = async (data: FormData) => {
  const MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 7 // 1 week

  const formDataValidationResult = signInSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!formDataValidationResult.success) {
    const errors = formDataValidationResult.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password } = formDataValidationResult.data

  try {
    const result = await signInWithPassword({
      email: String(email),
      password: String(password),
    })

    const token = result.token
    cookies().set('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: MAX_AGE_IN_SECONDS,
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
