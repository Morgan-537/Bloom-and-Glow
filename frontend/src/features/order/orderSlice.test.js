import orderReducer, { setDeliveryAddress, setBillingInfo, placeOrder } from './orderSlice'

describe('orderSlice', () => {
  const initialState = {
    deliveryAddress: { fullName: '', streetAddress: '', city: '', postalCode: '' },
    billingInfo: { nameOnCard: '', cardNumber: '', expiry: '', cvv: '' },
    orders: [],
    currentOrder: null,
  }

  it('updates delivery address fields without clobbering the others', () => {
    const step1 = orderReducer(initialState, setDeliveryAddress({ fullName: 'Jane Doe' }))
    const step2 = orderReducer(step1, setDeliveryAddress({ city: 'Nairobi' }))
    expect(step2.deliveryAddress).toEqual({
      fullName: 'Jane Doe',
      streetAddress: '',
      city: 'Nairobi',
      postalCode: '',
    })
  })

  it('updates billing info fields', () => {
    const next = orderReducer(initialState, setBillingInfo({ cardNumber: '4242424242424242' }))
    expect(next.billingInfo.cardNumber).toBe('4242424242424242')
  })

  it('places an order: generates an id, masks the card, and sets currentOrder', () => {
    const next = orderReducer(
      initialState,
      placeOrder({
        items: [{ id: 'a', name: 'A', category: 'Skincare', price: 10, quantity: 1 }],
        subtotal: 10,
        deliveryFee: 5,
        total: 15,
        deliveryAddress: { fullName: 'Jane Doe', streetAddress: '123 Rose Ave', city: 'Nairobi', postalCode: '00100' },
        billingInfo: { nameOnCard: 'Jane Doe', cardNumber: '4242424242424242', expiry: '12/28', cvv: '123' },
      })
    )

    expect(next.currentOrder).toBeTruthy()
    expect(next.currentOrder.id).toMatch(/^INV-/)
    expect(next.currentOrder.total).toBe(15)
    expect(next.currentOrder.billing.cardLast4).toBe('4242')
    expect(next.currentOrder.billing).not.toHaveProperty('cardNumber')
    expect(next.orders).toHaveLength(1)
    expect(next.orders[0]).toBe(next.currentOrder)
  })

  it('adds new orders to the front of order history', () => {
    const afterFirst = orderReducer(
      initialState,
      placeOrder({
        items: [],
        subtotal: 0,
        deliveryFee: 5,
        total: 5,
        deliveryAddress: initialState.deliveryAddress,
        billingInfo: { nameOnCard: 'A', cardNumber: '1111222233334444', expiry: '01/30', cvv: '111' },
      })
    )
    const afterSecond = orderReducer(
      afterFirst,
      placeOrder({
        items: [],
        subtotal: 0,
        deliveryFee: 5,
        total: 5,
        deliveryAddress: initialState.deliveryAddress,
        billingInfo: { nameOnCard: 'B', cardNumber: '5555666677778888', expiry: '02/31', cvv: '222' },
      })
    )
    expect(afterSecond.orders).toHaveLength(2)
    expect(afterSecond.orders[0].billing.cardLast4).toBe('8888') // most recently placed comes first
  })
})