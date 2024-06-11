'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createOrganization } from '@/http/create-organization'

const organizationSchema = z
  .object({
    name: z.string().min(4, {
      message: 'Please enter a valid organization name',
    }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            return /^[a-z0-9-]+\.[a-z]{2,}$/.test(value)
          }
          return true
        },
        {
          message: 'Please enter a valid domain',
        },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === 'on' || value === true)
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Please enter a valid domain',
      path: ['domain'],
    },
  )

export const createOrganizationAction = async (data: FormData) => {
  const formDataValidationResult = organizationSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!formDataValidationResult.success) {
    const errors = formDataValidationResult.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } =
    formDataValidationResult.data

  try {
    await createOrganization({
      name: String(name),
      domain: String(domain),
      shouldAttachUsersByDomain,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }
    console.error(error)
    return {
      success: false,
      message: 'An unknown error occurred',
      errors: null,
    }
  }

  return { success: true, message: 'Organization created', errors: null }
}
