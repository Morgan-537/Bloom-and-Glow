import { mockProducts } from './mockProducts'

describe('mockProducts', () => {
  it('has no duplicate product ids', () => {
    // Regression test: an earlier version of this file listed all 8 products
    // twice with colliding ids. That caused React key collisions in the
    // product grid, which made clicking a card sometimes open the wrong
    // product's detail page.
    const ids = mockProducts.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every product a name, a numeric price, and an image', () => {
    mockProducts.forEach((p) => {
      expect(p.name).toBeTruthy()
      expect(typeof p.price).toBe('number')
      expect(p.image).toMatch(/^https:\/\//)
    })
  })

  it('only uses free-license Unsplash photo URLs, not the paid Unsplash+ CDN', () => {
    mockProducts.forEach((p) => {
      expect(p.image).not.toMatch(/plus\.unsplash\.com/)
    })
  })
})
