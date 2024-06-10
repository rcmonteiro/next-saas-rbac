import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    userId: string
    role: Role
    organizationId: string
  }
}

export async function getMembership(org: string) {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()

  return result
}
