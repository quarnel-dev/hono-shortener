import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

import { nanoid } from 'nanoid'

import { createLinkSchema } from '../schemas/createLinks.schema'
import { linkResponseSchema } from '../schemas/linkResponse.schema'
import { errorSchema } from '../schemas/error.schema'

import { dbLinks } from '../db'

const links = new Hono()

links.post(
  '/',
  describeRoute({
    tags: ['links'],
    summary: 'Create short link',
    description: 'Generates a new short URL code or accepts a custom slug',
    responses: {
      201: {
        description: 'Short link created successfully',
        content: { 'application/json': { schema: resolver(linkResponseSchema) } },
      },
      400: {
        description: 'Validation failed or invalid URL',
        content: {
          'application/json': { schema: resolver(errorSchema) },
        },
      },
      409: {
        description: 'Custom code already in use',
        content: {
          'application/json': { schema: resolver(errorSchema) },
        },
      },
    },
  }),
  validator('json', createLinkSchema, (res, ctx) => {
    if (!res.success) {
      const firstIssue = res.error[0]?.message || 'Validation failed'
      return ctx.json({ error: firstIssue }, 400)
    }
  }),
  (ctx) => {
    const { url, code: customCode } = ctx.req.valid('json')
    const code = customCode ?? nanoid(6)

    if (customCode) {
      const existing = dbLinks.findByCode(customCode)
      if (existing) {
        return ctx.json({ error: 'Code already in use' }, 409)
      }
    }

    try {
      dbLinks.create(code, url)
    } catch {
      return ctx.json({ error: 'Code already in use' }, 409)
    }

    const origin = new URL(ctx.req.url).origin
    const shortUrl = `${origin}/${code}`

    return ctx.json({ code, url, shortUrl }, 201)
  }
)

export default links
