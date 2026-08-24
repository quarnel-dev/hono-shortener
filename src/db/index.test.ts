import { describe, expect, test, beforeEach } from 'bun:test'
import { db, dbLinks } from './index'

describe('DB Operations', () => {
  beforeEach(() => {
    db.run('DELETE FROM links')
  })

  test('should create and find link by code', () => {
    const code = 'google'
    const url = 'https://google.com'
    dbLinks.create(code, url)

    const link = dbLinks.findByCode(code)
    expect(link).not.toBeNull()
    expect(link?.code).toBe(code)
    expect(link?.url).toBe(url)
    expect(link?.clicks).toBe(0)
  })

  test('should increment click counter', () => {
    const code = 'github'
    const url = 'https://github.com'

    dbLinks.create(code, url)
    dbLinks.incrementClicks(code)
    dbLinks.incrementClicks(code)

    const link = dbLinks.findByCode(code)
    expect(link?.clicks).toBe(2)
  })

  test('should throw error on unique constraint violation (duplicate code)', () => {
    const code = 'unique'
    dbLinks.create(code, 'https://google.com')

    expect(() => {
      dbLinks.create(code, 'https://github.com')
    }).toThrow()
  })

  test('should fetch all links', () => {
    dbLinks.create('code1', 'https://one.com')
    dbLinks.create('code2', 'https://two.com')

    const links = dbLinks.findAll()
    expect(links.length).toBe(2)
  })

  test('should delete link by code', () => {
    const code = 'code'
    dbLinks.create(code, 'https://delete.com')

    const res = dbLinks.delete(code)

    expect(res.changes).toBe(1)
    expect(dbLinks.findByCode(code)).toBeNull()
  })
})
