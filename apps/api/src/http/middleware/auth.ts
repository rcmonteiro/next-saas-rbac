import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

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
  })
})
