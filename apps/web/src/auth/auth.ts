import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export const isAuthenticated = () => {
  return !!cookies().get('token')?.value
}

export const auth = async () => {
  const token = cookies().get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch (e) {}

  redirect('/api/auth/sign-out')
}
