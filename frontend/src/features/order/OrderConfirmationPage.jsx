import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentOrder } from './orderSlice'

function formatPrice(amount) {
  return `$${amount.toFixed(2)}`
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function OrderConfirmationPage() {
  const order = useSelector(selectCurrentOrder)

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No order to show</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
        <Link to="/cart" className="text-rose-600 font-semibold hover:underline">
          Back to your cart
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-lg border border-rose-100 p-8">
        <div className="text-center mb-8">
          <p className="text-rose-600 font-semibold mb-1">✓ Order Confirmed</p>
          <h1 className="text-2xl font-bold text-gray-900">Thank you for your order!</h1>
          <p className="text-gray-500 text-sm mt-1">
            Invoice {order.id} · placed {formatDate(order.placedAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Delivery Address</h2>
            <p className="text-gray-600">{order.deliveryAddress.fullName}</p>
            <p className="text-gray-600">{order.deliveryAddress.streetAddress}</p>
            <p className="text-gray-600">
              {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Billing</h2>
            <p className="text-gray-600">{order.billing.nameOnCard}</p>
            <p className="text-gray-600">Card ending in {order.billing.cardLast4}</p>
            <p className="text-green-600 font-medium mt-1">{order.status}</p>
          </div>
        </div>

        <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
        <div className="flex flex-col gap-3 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 pb-3">
              <div>
                <p className="text-gray-900">{item.name}</p>
                <p className="text-gray-500">
                  {item.category} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-gray-900 font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm mb-8">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
            <span>Total</span>
            <span className="text-rose-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="text-center">
          <Link to="/cart" className="text-rose-600 font-semibold hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage