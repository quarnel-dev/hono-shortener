import * as v from 'valibot'

export const createLinkSchema = v.object({
  url: v.pipe(v.string('URL must be a string'), v.nonEmpty('URL is required'), v.url('Invalid URL format')),
  code: v.optional(
    v.pipe(
      v.string('Code must be a string'),
      v.minLength(3, 'Code must be at least 3 characters'),
      v.maxLength(20, 'Code must be at most 20 characters'),
      v.regex(/^[a-zA-Z0-9_-]+$/, 'Code can only contain letters, numbers, hyphens, and underscores')
    )
  ),
})

export type CreateLinkInput = v.InferInput<typeof createLinkSchema>
