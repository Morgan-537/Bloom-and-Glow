import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCartItems, selectSubtotal, selectDeliveryFee, selectCartTotal, clearCart } from '../cart/cartSlice'
import {
  selectDeliveryAddress,
  selectBillingInfo,
  setDeliveryAddress,
  setBillingInfo,
  placeOrder,
} from '../order/orderSlice'

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`
}

function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectSubtotal)
  const deliveryFee = useSelector(selectDeliveryFee)
  const total = useSelector(selectCartTotal)

  const deliveryAddress = useSelector(selectDeliveryAddress)
  const billingInfo = useSelector(selectBillingInfo)

  const handleAddressChange = (field) => (event) => {
    dispatch(setDeliveryAddress({ [field]: event.target.value }))
  }

  const handleBillingChange = (field) => (event) => {
    dispatch(setBillingInfo({ [field]: event.target.value }))
  }

  const isFormComplete =
    deliveryAddress.fullName &&
    deliveryAddress.streetAddress &&
    deliveryAddress.city &&
    deliveryAddress.postalCode &&
    billingInfo.nameOnCard &&
    billingInfo.cardNumber &&
    billingInfo.expiry &&
    billingInfo.cvv

  const handlePlaceOrder = () => {
    dispatch(placeOrder({ items, subtotal, deliveryFee, total, deliveryAddress, billingInfo }))
    dispatch(clearCart())
    navigate('/order-confirmation')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">1. Delivery Address</h2>
            <div className="bg-white rounded-lg border border-rose-100 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm text-gray-600">Full name</span>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={deliveryAddress.fullName}
                  onChange={handleAddressChange('fullName')}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm text-gray-600">Street address</span>
                <input
                  type="text"
                  placeholder="123 Rose Avenue"
                  value={deliveryAddress.streetAddress}
                  onChange={handleAddressChange('streetAddress')}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">City</span>
                <input
                  type="text"
                  placeholder="Nairobi"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange('city')}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Postal code</span>
                <input
                  type="text"
                  placeholder="00100"
                  value={deliveryAddress.postalCode}
                  onChange={handleAddressChange('postalCode')}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. Billing Information</h2>
            <div className="bg-white rounded-lg border border-rose-100 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-sm text-gray-600">Name on card (simulated)</span>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={billingInfo.nameOnCard}
                  onChange={handleBillingChange('nameOnCard')}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Card number (simulated)</span>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={billingInfo.cardNumber}
                  onChange={handleBillingChange('cardNumber')}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </label>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">Expiry / CVV</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="12/28"
                    value={billingInfo.expiry}
                    onChange={handleBillingChange('expiry')}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <input
                    type="text"
                    placeholder="123"
                    value={billingInfo.cvv}
                    onChange={handleBillingChange('cvv')}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 sm:col-span-2">
                Payment is simulated internally — no real transaction occurs.
              </p>
            </div>
          </section>
        </div>

        <div className="bg-white rounded-lg border border-rose-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <p className="text-sm text-gray-500 mb-4">{items.length} items</p>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Delivery</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-4 mb-6">
            <span>Total</span>
            <span className="text-rose-600">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={!isFormComplete}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors"
          >
            Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage