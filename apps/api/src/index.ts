import { defineAbilityFor, projectSchema } from '@saas/auth'
import { randomUUID } from 'crypto'

const userId = randomUUID()

const ability = defineAbilityFor({
  id: userId,
  role: 'MEMBER',
})

const project = projectSchema.parse({
  id: randomUUID(),
  name: 'Test',
  ownerId: userId,
})

console.log(ability.can('get', 'Billing'))
console.log(ability.can('create', 'Invite'))
console.log(ability.can('delete', project))
