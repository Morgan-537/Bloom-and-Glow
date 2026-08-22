import cartReducer, {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  selectSubtotal,
  selectCartTotal,
} from './cartSlice'

describe('cartSlice', () => {
  const initialState = {
    items: [
      { id: 'a', name: 'A', category: 'Skincare', price: 10, quantity: 1 },
      { id: 'b', name: 'B', category: 'Makeup', price: 20, quantity: 2 },
    ],
    deliveryFee: 5,
  }

  it('increments quantity of an existing item', () => {
    const next = cartReducer(initialState, incrementQuantity('a'))
    expect(next.items.find((i) => i.id === 'a').quantity).toBe(2)
  })

  it('does not go below quantity 1 when decrementing', () => {
    const next = cartReducer(initialState, decrementQuantity('a'))
    expect(next.items.find((i) => i.id === 'a').quantity).toBe(1)
  })

  it('removes an item by id', () => {
    const next = cartReducer(initialState, removeItem('a'))
    expect(next.items.find((i) => i.id === 'a')).toBeUndefined()
    expect(next.items).toHaveLength(1)
  })

  it('adds a new item, or increments quantity if it already exists', () => {
    const added = cartReducer(initialState, addItem({ id: 'c', name: 'C', category: 'Haircare', price: 8 }))
    expect(added.items).toHaveLength(3)

    const incremented = cartReducer(
      initialState,
      addItem({ id: 'a', name: 'A', category: 'Skincare', price: 10, quantity: 3 })
    )
    expect(incremented.items.find((i) => i.id === 'a').quantity).toBe(4)
  })

  it('clears all items', () => {
    const next = cartReducer(initialState, clearCart())
    expect(next.items).toHaveLength(0)
  })

  it('selects subtotal as sum of price * quantity', () => {
    const state = { cart: initialState }
    expect(selectSubtotal(state)).toBe(10 * 1 + 20 * 2) // 50
  })

  it('selects total as subtotal + delivery fee', () => {
    const state = { cart: initialState }
    expect(selectCartTotal(state)).toBe(50 + 5) // 55
  })
})