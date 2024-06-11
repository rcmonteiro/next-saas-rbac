'use server'

import { env } from '@saas/env'
import { redirect } from 'next/navigation'

export const signInWithGithub = async () => {
  const gitHubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')
  gitHubSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  gitHubSignInUrl.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
  )
  gitHubSignInUrl.searchParams.set('scope', 'user')
  redirect(gitHubSignInUrl.toString())
}
