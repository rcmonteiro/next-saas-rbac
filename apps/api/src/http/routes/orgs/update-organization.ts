import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { db } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export const updateOrganization = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Orgs'],
          summary: 'Update a organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
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
        const { name, domain, shouldAttachUsersByDomain } = request.body

        const { cannot } = getUserPermissions(userId, membership.role)
        const authOrganization = organizationSchema.parse({
          id: organization.id,
          ownerId: organization.ownerId,
        })

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError('Not allowed to update this Organization')
        }

        if (domain) {
          const organizationWithSameDomainExists =
            await db.organization.findFirst({
              where: {
                domain,
                id: {
                  not: organization.id,
                },
              },
            })

          if (organizationWithSameDomainExists) {
            throw new BadRequestError('Organization already exists')
          }
        }

        await db.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain: !!shouldAttachUsersByDomain,
          },
        })

        return reply.status(204).send()
      },
    )
}
