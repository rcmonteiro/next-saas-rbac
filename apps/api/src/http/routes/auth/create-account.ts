import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { db } from '@/lib/prisma'

export const createAccount = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const useWithSameEmailExists = await db.user.findUnique({
        where: { email },
      })

      if (useWithSameEmailExists) {
        return reply.status(400).send({
          message: 'User already exists',
        })
      }

      const hashedPassword = await hash(password, 6)

      await db.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
        },
      })

      return reply.status(201).send()
    },
  )
}
