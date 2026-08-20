import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartItemCount } from '../features/cart/cartSlice'

const OTHER_SECTIONS = ['Shop', 'Skincare', 'Haircare', 'Makeup']

function Header() {
  const location = useLocation()
  const cartItemCount = useSelector(selectCartItemCount)
  const isCartActive = location.pathname === '/cart'

  return (
    <header className="bg-white border-b border-rose-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/cart" className="text-2xl font-bold text-rose-600">
          Bloom &amp; Glow
        </Link>
        <nav className="flex items-center gap-8 text-sm font-medium">
          {OTHER_SECTIONS.map((label) => (
            <span
              key={label}
              className="text-gray-400 cursor-not-allowed"
              title="Built by another team member — not part of this branch"
            >
              {label}
            </span>
          ))}
          <Link
            to="/cart"
            className={isCartActive ? 'text-rose-600 font-semibold' : 'text-gray-600 hover:text-rose-600'}
          >
            Cart{cartItemCount > 0 ? ` (${cartItemCount})` : ''}
          </Link>
          <span className="text-gray-400 cursor-not-allowed" title="Built by another team member">
            Account
          </span>
        </nav>
      </div>
    </header>
  )
}

export default Header