import { generateSlug, withSlugSuffix } from '../../../src/utils/slug.js'

describe('generateSlug', () => {
  it('turns a title into a url slug', () => {
    expect(generateSlug('How AI Is Changing Web Development')).toBe('how-ai-is-changing-web-development')
  })

  it('adds a numeric suffix when a slug is already used', () => {
    expect(withSlugSuffix('how-ai-is-changing-web-development', 2)).toBe('how-ai-is-changing-web-development-2')
  })
})
