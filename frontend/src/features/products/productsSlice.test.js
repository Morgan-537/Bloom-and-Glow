import productsReducer, { loadProducts, addProduct, updateProduct, deleteProduct } from './productsSlice'

// Same approach as authSlice.test.js: dispatch the plain .pending/.fulfilled/
// .rejected action objects these async thunks produce, instead of calling
// the thunks themselves — so these tests exercise the reducer logic without
// needing json-server running.

describe('productsSlice', () => {
  const initialState = {
    items: [
      { id: 1, name: 'Rose Facial Serum', category: 'Skincare', price: 24, stock: 42, status: 'Active', image: 'https://images.unsplash.com/a' },
      { id: 2, name: 'Argan Hair Oil', category: 'Haircare', price: 15, stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/b' },
    ],
    searchTerm: '',
    activeCategory: 'All',
    status: 'idle',
    error: null,
  }

  it('loadProducts.pending sets status to loading and clears any previous error', () => {
    const withError = { ...initialState, error: 'previous error' }
    const next = productsReducer(withError, { type: loadProducts.pending.type })
    expect(next.status).toBe('loading')
    expect(next.error).toBeNull()
  })

  it('loadProducts.fulfilled replaces items with the fetched catalog', () => {
    const fetched = [{ id: 9, name: 'New Arrival', category: 'Makeup', price: 10, stock: 5, status: 'Low Stock', image: '' }]
    const next = productsReducer(initialState, { type: loadProducts.fulfilled.type, payload: fetched })
    expect(next.status).toBe('succeeded')
    expect(next.items).toEqual(fetched)
  })

  it('loadProducts.rejected stores the error message', () => {
    const next = productsReducer(initialState, {
      type: loadProducts.rejected.type,
      payload: 'Could not reach the server. Make sure `npm run server` is running on port 4000.',
    })
    expect(next.status).toBe('failed')
    expect(next.error).toMatch(/npm run server/)
  })

  it('addProduct.fulfilled adds the server-returned product to the front of the catalog', () => {
    const created = { id: 3, name: 'New Serum', category: 'Skincare', price: 30, stock: 5, status: 'Low Stock', image: '' }
    const next = productsReducer(initialState, { type: addProduct.fulfilled.type, payload: created })
    expect(next.items).toHaveLength(3)
    expect(next.items[0].name).toBe('New Serum')
  })

  it('updateProduct.fulfilled updates the matching product without touching the others', () => {
    const updated = { id: 2, name: 'Argan Hair Oil', category: 'Haircare', price: 18, stock: 20, status: 'Active', image: 'https://images.unsplash.com/b' }
    const next = productsReducer(initialState, { type: updateProduct.fulfilled.type, payload: updated })
    expect(next.items.find((p) => p.id === 2).price).toBe(18)
    expect(next.items.find((p) => p.id === 2).status).toBe('Active')
    expect(next.items.find((p) => p.id === 1).price).toBe(24) // untouched
  })

  it('deleteProduct.fulfilled removes the product by id', () => {
    const next = productsReducer(initialState, { type: deleteProduct.fulfilled.type, payload: 1 })
    expect(next.items).toHaveLength(1)
    expect(next.items.find((p) => p.id === 1)).toBeUndefined()
  })
})
