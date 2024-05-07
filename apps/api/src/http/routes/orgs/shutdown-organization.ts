import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { db } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export const shutdownOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Orgs'],
          summary: 'Shutdown a organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        const authOrganization = organizationSchema.parse({
          id: organization.id,
          ownerId: organization.ownerId,
        })

        if (cannot('delete', authOrganization)) {
          throw new UnauthorizedError(
            'Not allowed to shutdown this Organization',
          )
        }

        await db.organization.delete({
          where: {
            id: organization.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
