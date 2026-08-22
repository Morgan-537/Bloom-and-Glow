import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  deliveryAddress: {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
  },
  billingInfo: {
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  },
  orders: [],        // order history, most recent first
  currentOrder: null, // the order just placed, shown on the confirmation page
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = { ...state.deliveryAddress, ...action.payload }
    },
    setBillingInfo: (state, action) => {
      state.billingInfo = { ...state.billingInfo, ...action.payload }
    },
    // Admin's Orders page uses this to advance fulfillment
    // (Processing -> Shipped -> Delivered, or Cancelled).
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload
      const order = state.orders.find((o) => o.id === id)
      if (order) order.status = status
      if (state.currentOrder?.id === id) state.currentOrder.status = status
    },
    // "prepare" lets us shape the payload (generate an invoice id, timestamp,
    // mask the card number) BEFORE it reaches the reducer.
    placeOrder: {
      reducer: (state, action) => {
        state.orders.unshift(action.payload)
        state.currentOrder = action.payload
      },
      prepare: ({ items, subtotal, deliveryFee, total, deliveryAddress, billingInfo }) => {
        const placedAt = new Date()
        return {
          payload: {
            id: `INV-${placedAt.getTime()}`,
            placedAt: placedAt.toISOString(),
            // Denormalized here so admin's order table doesn't need a
            // separate customer/user lookup — orders don't track a userId
            // yet, so this is the best identity we have per order.
            customer: deliveryAddress.fullName,
            items,
            subtotal,
            deliveryFee,
            total,
            deliveryAddress,
            billing: {
              nameOnCard: billingInfo.nameOnCard,
              cardLast4: billingInfo.cardNumber.slice(-4),
            },
            // Payment is simulated and always "succeeds", so the order moves
            // straight into fulfillment — admin advances it from here via
            // updateOrderStatus (Processing -> Shipped -> Delivered/Cancelled).
            status: 'Processing',
          },
        }
      },
    },
  },
})

export const { setDeliveryAddress, setBillingInfo, placeOrder, updateOrderStatus } = orderSlice.actions

export const selectDeliveryAddress = (state) => state.order.deliveryAddress
export const selectBillingInfo = (state) => state.order.billingInfo
export const selectCurrentOrder = (state) => state.order.currentOrder
export const selectOrderHistory = (state) => state.order.orders

export default orderSlice.reducer
