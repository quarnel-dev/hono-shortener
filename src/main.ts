import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'
import { Scalar } from '@scalar/hono-api-reference'

import links from './routes/links.route'
import redirect from './routes/redirect.route'

const app = new Hono()

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
