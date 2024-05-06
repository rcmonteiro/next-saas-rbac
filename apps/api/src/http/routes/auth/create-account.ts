import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-errors'

export const createAccount = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const useWithSameEmailExists = await db.user.findUnique({
        where: { email },
      })

      if (useWithSameEmailExists) {
        throw new BadRequestError('User already exists')
      }

      const [, domain] = email.split('@')

      const autoJoinOrganization = await db.organization.findFirst({
        where: { domain, shouldAttachUsersByDomain: true },
      })

      const hashedPassword = await hash(password, 6)

      await db.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          member_on: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
