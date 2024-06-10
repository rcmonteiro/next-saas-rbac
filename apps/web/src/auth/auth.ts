import { cookies } from 'next/headers'

export const isAuthenticated = () => {
  return !!cookies().get('token')?.value
}
