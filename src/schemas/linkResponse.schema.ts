import * as v from 'valibot'

export const linkResponseSchema = v.object({
  code: v.string(),
  url: v.string(),
  shortUrl: v.string(),
})
