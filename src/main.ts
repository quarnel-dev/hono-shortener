import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'
import { Scalar } from '@scalar/hono-api-reference'

import links from './routes/links.route'
import redirect from './routes/redirect.route'

const app = new Hono()

app.notFound((ctx) => {
  return ctx.json({ error: 'Not Found' }, 404)
})

app.onError((err, c) => {
  console.error(`[ Server Error ]: ${err.message}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

app.route('/links', links)

app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'URL Shortener API',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
    },
  })
)

app.get(
  '/scalar',
  Scalar({
    theme: 'saturn',
    spec: {
      url: '/openapi',
    },
  })
)

app.route('/', redirect)

export default app
