import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middleware/auth'
import { db } from '@/lib/prisma'

export const requestPasswordRecover = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/password/recover',
      {
        schema: {
          tags: ['Auth'],
          summary: 'Request password recovery',
          body: z.object({
            email: z.string().email(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { email } = request.body

        const user = await db.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })

        if (!user) {
          return reply.status(201).send() // Não dar dica que o usuário não existe
        }

        const { id: code } = await db.token.create({
          data: {
            userId: user.id,
            type: 'PASSWORD_RECOVER',
          },
        })

        // TODO: Send e-mail with password recover link

        console.log(`Recover password token: ${code}`) // Only for DEV environment!

        return reply.status(201).send()
      },
    )
}
