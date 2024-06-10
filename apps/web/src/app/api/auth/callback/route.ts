import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { signInWithGithub } from '@/http/sign-in-with-github'

export const GET = async (request: NextRequest) => {
  const MAX_AGE_IN_SECONDS = 60 * 60 * 24 * 7 // 1 week
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code was not found' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGithub({ code })
  cookies().set('token', token, {
    path: '/',
    httpOnly: true,
    maxAge: MAX_AGE_IN_SECONDS,
  })
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/'
  redirectUrl.searchParams.delete('code')
  return NextResponse.redirect(redirectUrl)
}
