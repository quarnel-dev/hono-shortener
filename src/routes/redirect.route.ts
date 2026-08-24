import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'

import { errorSchema } from '../schemas/error.schema'

import { dbLinks } from '../db'

const redirect = new Hono()

redirect.get(
  '/:code',
  describeRoute({
    tags: ['redirect'],
    summary: 'Redirect to target URL',
    description: 'Increments click counter and redirects (302) to original URL',
    responses: {
      302: {
        description: 'Found and redirecting to original URL',
      },
      404: {
        description: 'Short link code not found',
        content: { 'application/json': { schema: resolver(errorSchema) } },
      },
    },
  }),
  (ctx) => {
    const code = ctx.req.param('code')
    const link = dbLinks.findByCode(code)

    if (!link) return ctx.json({ error: 'Link not found' }, 404)

    dbLinks.incrementClicks(code)

    return ctx.redirect(link.url, 302)
  }
)

export default redirect
