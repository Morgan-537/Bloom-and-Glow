import { createSlice } from '@reduxjs/toolkit'

// Seeded with the same mock items from the Figma wireframe, so the demo
// matches the design: Subtotal $66.00 + Delivery $5.00 = Total $71.00
const initialState = {
  items: [
    { id: 'skincare-rose-serum', name: 'Rose Facial Serum', category: 'Skincare', price: 24.0, quantity: 1 },
    { id: 'haircare-argan-oil', name: 'Argan Hair Oil', category: 'Haircare', price: 15.0, quantity: 2 },
    { id: 'makeup-matte-lipstick', name: 'Matte Lipstick - Rouge', category: 'Makeup', price: 12.0, quantity: 1 },
  ],
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