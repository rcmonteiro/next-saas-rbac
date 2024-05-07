import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { db } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export const getInvites = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organizations/:slug/invites',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get organization invites',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            invites: z.array(
              z.object({
                id: z.string(),
                email: z.string(),
                role: roleSchema,
                createdAt: z.date(),
                author: z
                  .object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                  })
                  .nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()
      const { slug } = request.params
      const { membership, organization } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('get', 'Invite')) {
        throw new UnauthorizedError('Not allowed to get organization invites')
      }

      const invites = await db.invite.findMany({
        where: {
          organizationId: organization.id,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return reply.status(200).send({
        invites,
      })
    },
  )
}
