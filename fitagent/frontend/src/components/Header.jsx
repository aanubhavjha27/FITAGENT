import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Header() {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🏋️</span>
          <span className="text-xl font-bold text-indigo-600">
            FitAgent
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}