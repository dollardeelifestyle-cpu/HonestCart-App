import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to HonestCart</h1>
        <p>Your trusted marketplace for quality products and honest sellers</p>
        <Link to="/products" className="cta-button">Shop Now</Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🛍️ Vast Selection</h3>
          <p>Browse thousands of products from trusted sellers</p>
        </div>
        <div className="feature">
          <h3>✅ Quality Assured</h3>
          <p>All products and sellers are verified</p>
        </div>
        <div className="feature">
          <h3>🚚 Fast Shipping</h3>
          <p>Quick and reliable delivery to your doorstep</p>
        </div>
        <div className="feature">
          <h3>💳 Secure Payments</h3>
          <p>Safe and encrypted payment processing</p>
        </div>
      </section>
    </div>
  )
}
