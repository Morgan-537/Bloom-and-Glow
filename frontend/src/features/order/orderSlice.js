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
            items,
            subtotal,
            deliveryFee,
            total,
            deliveryAddress,
            billing: {
              nameOnCard: billingInfo.nameOnCard,
              cardLast4: billingInfo.cardNumber.slice(-4),
            },
            status: 'Payment Simulated - Confirmed',
          },
        }
      },
    },
  },
})

export const { setDeliveryAddress, setBillingInfo, placeOrder } = orderSlice.actions

export const selectDeliveryAddress = (state) => state.order.deliveryAddress
export const selectBillingInfo = (state) => state.order.billingInfo
export const selectCurrentOrder = (state) => state.order.currentOrder
export const selectOrderHistory = (state) => state.order.orders

export default orderSlice.reducer