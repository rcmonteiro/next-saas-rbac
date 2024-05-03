import { defineAbilityFor } from '@saas/auth'
import { randomUUID } from 'crypto'

const ability = defineAbilityFor({
  __typename: 'User',
  id: randomUUID(),
  role: 'ADMIN',
})

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteSomeoneElse = ability.can('delete', 'User')

const userCannotDeleteAnotherUser = ability.cannot('delete', 'User')

console.log(userCanInviteSomeoneElse)
console.log(userCanDeleteSomeoneElse)
console.log(userCannotDeleteAnotherUser)
