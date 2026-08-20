import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import CartPage from './features/cart/CartPage'
import CheckoutPage from './features/checkout/CheckoutPage'
import OrderConfirmationPage from './features/order/OrderConfirmationPage'

function App() {
  return (
    <div className="min-h-screen bg-rose-50">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/cart" replace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App