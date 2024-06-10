import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMembership } from '@/http/get-membership'
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

export const getCurrentOrg = () => {
  return cookies().get('org')?.value ?? null
}

export const getCurrentMemberShip = async () => {
  const org = getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export const ability = async () => {
  const membership = await getCurrentMemberShip()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}
