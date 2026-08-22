import { createSlice } from '@reduxjs/toolkit'

// Cart starts empty — a real visitor shouldn't land on a pre-filled cart.
// (This used to be seeded with 3 hardcoded demo items matching the Figma
// wireframe, from before "Add to Cart" was wired up to real products. Now
// that Home/ProductDetail dispatch real product data — including images —
// those hardcoded items were stale leftovers with no `image` field, which
// is why they showed a blank placeholder instead of a photo.)
const initialState = {
  items: [],
  deliveryFee: 5.0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const incoming = action.payload
      const existing = state.items.find((item) => item.id === incoming.id)
      if (existing) {
        existing.quantity += incoming.quantity || 1
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity || 1 })
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.quantity += 1
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload)
      if (item && item.quantity > 1) item.quantity -= 1
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addItem, removeItem, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions

// Selectors: plain functions that read/derive data from the store.
// Components use these instead of reaching into state shape directly.
export const selectCartItems = (state) => state.cart.items
export const selectDeliveryFee = (state) => state.cart.deliveryFee
export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
export const selectCartTotal = (state) => selectSubtotal(state) + state.cart.deliveryFee
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export default cartSlice.reducer