import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/lib/prisma'

export const authenticateWithPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with password',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const useExists = await db.user.findUnique({
        where: { email },
      })

      if (!useExists) {
        return reply.status(401).send({
          message: 'Wrong Credentials',
        })
      }

      if (useExists.passwordHash === null) {
        return reply.status(400).send({
          message: 'User does not have a password, use social login',
        })
      }

      const passwordMatch = await compare(password, useExists.passwordHash)

      if (!passwordMatch) {
        return reply.status(401).send({
          message: 'Wrong Credentials',
        })
      }

      const token = await reply.jwtSign(
        {
          sub: useExists.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(200).send({
        token,
      })
    },
  )
}
