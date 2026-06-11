import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 HonestCart
        </Link>
        <div className="nav-links">
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          
          {token ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/seller-dashboard">Seller</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
