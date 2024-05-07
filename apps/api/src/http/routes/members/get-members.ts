import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { db } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export const getMembers = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get all organization members',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  userId: z.string(),
                  id: z.string().uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                  email: z.string().email(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'User')) {
          throw new UnauthorizedError('Not allowed to get Organization Members')
        }

        const members = await db.member.findMany({
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            role: 'asc',
          },
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        })

        const membersWithRoles = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...user,
              ...member,
              userId,
            }
          },
        )

        return reply.status(200).send({
          members: membersWithRoles,
        })
      },
    )
}
