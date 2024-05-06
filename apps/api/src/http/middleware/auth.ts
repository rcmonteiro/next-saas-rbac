import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { db } from '@/lib/prisma'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub: userId } = await request.jwtVerify<{ sub: string }>()
        return userId
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId()
      const member = await db.member.findFirst({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        include: {
          organization: true,
        },
      })

      if (!member) {
        throw new UnauthorizedError('User is not a member of this organization')
      }

      const { organization, ...membership } = member

      return {
        organization,
        membership,
      }
    }
  })
})
