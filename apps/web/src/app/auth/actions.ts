import { redirect } from 'next/navigation'

export const signInWithGithub = async () => {
  const gitHubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')
  gitHubSignInUrl.searchParams.set('client_id', 'Ov23liNZstRIbpjxMvOP')
  gitHubSignInUrl.searchParams.set(
    'redirect_uri',
    'http://localhost:3000/api/auth/callback',
  )
  gitHubSignInUrl.searchParams.set('scope', 'user')
  redirect(gitHubSignInUrl.toString())
}
// GITHUB_OAUTH_CLIENT_ID
// GITHUB_OAUTH_CLIENT_REDIRECT_URI
