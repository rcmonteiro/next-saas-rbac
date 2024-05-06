import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { db } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export const resetPassword = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/reset',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Reset password',
          body: z.object({
            code: z.string(),
            password: z.string().min(6),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { code, password } = request.body

        const tokenFromCode = await db.token.findUnique({
          where: {
            id: code,
          },
        })

        if (!tokenFromCode) {
          throw new UnauthorizedError('Invalid reset token')
        }

        const hashedPassword = await hash(password, 6)

        await db.user.update({
          data: {
            passwordHash: hashedPassword,
          },
          where: {
            id: tokenFromCode.userId,
          },
        })

        return reply.status(204).send()
      },
    )
}
