import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    return redirect('/auth/sign-in')
  }
  return <>{children}</>
}
