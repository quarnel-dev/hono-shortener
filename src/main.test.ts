import { describe, expect, test } from 'bun:test'
import app from './main'

describe('URL Shortener E2E API', () => {
  let createdCode = ''

  test('POST /links — should create short link and return 201', async () => {
    const res = await app.request('/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://github.com' }),
    })

    expect(res.status).toBe(201)
    const data = (await res.json()) as any
    expect(data).toHaveProperty('code')
    expect(data.url).toBe('https://github.com')
    expect(data).toHaveProperty('shortUrl')

    createdCode = data.code
  })

  test('POST /links — should return 400 for invalid URL', async () => {
    const res = await app.request('/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'not-a-valid-url' }),
    })

    expect(res.status).toBe(400)
    const data = (await res.json()) as any
    expect(data).toHaveProperty('error')
  })

  test('GET /links — should return array of all links', async () => {
    const res = await app.request('/links')
    expect(res.status).toBe(200)

    const data = (await res.json()) as any[]
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  test('GET /links/:code/stats — should return link statistics', async () => {
    const res = await app.request(`/links/${createdCode}/stats`)
    expect(res.status).toBe(200)

    const data = (await res.json()) as any
    expect(data.code).toBe(createdCode)
    expect(data).toHaveProperty('clicks')
  })

  test('GET /:code — should perform 302 redirect', async () => {
    const res = await app.request(`/${createdCode}`)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('https://github.com')
  })

  test('GET /non-existent-route — should return custom 404 JSON', async () => {
    const res = await app.request('/some/rrr/route')
    expect(res.status).toBe(404)

    const data = (await res.json()) as any
    expect(data).toEqual({ error: 'Not Found' })
  })

  test('DELETE /links/:code — should successfully delete link', async () => {
    const res = await app.request(`/links/${createdCode}`, {
      method: 'DELETE',
    })
    expect(res.status).toBe(204)
  })
})
