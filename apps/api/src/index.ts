import { defineAbilityFor } from '@saas/auth'
import { randomUUID } from 'crypto'

const ability = defineAbilityFor({
  id: randomUUID(),
  role: 'MEMBER',
})

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteSomeoneElse = ability.can('delete', 'User')

const userCannotDeleteAnotherUser = ability.cannot('delete', 'User')

console.log(userCanInviteSomeoneElse)
console.log(userCanDeleteSomeoneElse)
console.log(userCannotDeleteAnotherUser)
