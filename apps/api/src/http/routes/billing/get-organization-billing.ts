import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { db } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export const getOrganizationBilling = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          tags: ['Orgs'],
          summary: 'Get Billing data from organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { slug } = request.params
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Billing')) {
          throw new BadRequestError(
            'You are not allowed to get billing information from this organization',
          )
        }

        const [memberCount, projectCount] = await Promise.all([
          db.member.count({
            where: {
              organizationId: organization.id,
              role: { not: 'BILLING' },
            },
          }),

          db.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        return {
          billing: {
            seats: {
              amount: memberCount,
              unit: 10,
              price: memberCount * 10,
            },
            projects: {
              amount: projectCount,
              unit: 20,
              price: projectCount * 10,
            },
            total: memberCount * 10 + projectCount * 20,
          },
        }
      },
    )
}
