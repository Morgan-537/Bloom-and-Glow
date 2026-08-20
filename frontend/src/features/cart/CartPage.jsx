import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectCartItems,
  selectSubtotal,
  selectDeliveryFee,
  selectCartTotal,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from './cartSlice'

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`
}

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectSubtotal)
  const deliveryFee = useSelector(selectDeliveryFee)
  const total = useSelector(selectCartTotal)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white rounded-lg border border-rose-100 p-4"
              >
                <div className="w-16 h-16 rounded-md bg-rose-100 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-sm text-rose-600 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-1">
                  <button
                    onClick={() => dispatch(decrementQuantity(item.id))}
                    className="px-2 text-gray-600 hover:text-rose-600 disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(incrementQuantity(item.id))}
                    className="px-2 text-gray-600 hover:text-rose-600"
                  >
                    +
                  </button>
                </div>
                <div className="w-20 text-right font-semibold text-rose-600">
                  {formatPrice(item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-rose-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
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
              onClick={() => navigate('/checkout')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-md transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage