import * as v from 'valibot'

export const linkStatsSchema  = v.object({
  url: v.string(),
  code: v.string(),
  clicks: v.number(),
  created_at: v.string(),
})
