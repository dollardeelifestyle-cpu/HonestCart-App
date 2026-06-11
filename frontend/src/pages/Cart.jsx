import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(res.data)
    } catch (err) {
      console.error('Failed to fetch cart')
    }
    setLoading(false)
  }

  const removeFromCart = async (productId) => {
    try {
      await axios.post('/api/cart/remove', { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCart()
    } catch (err) {
      alert('Failed to remove item')
    }
  }

  const checkout = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is empty')
      return
    }
    // Redirect to checkout page (to be implemented)
    alert('Checkout coming soon!')
  }

  if (loading) return <p>Loading...</p>
  if (!token) return <p>Please login to view your cart</p>
  if (!cart) return <p>Cart not found</p>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.product._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              <h3>{item.product.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p style={{ fontSize: '1.2rem', color: '#27ae60' }}>
                ${item.product.price * item.quantity}
              </p>
              <button onClick={() => removeFromCart(item.product._id)} style={{ backgroundColor: '#e74c3c' }}>
                Remove
              </button>
            </div>
          ))}
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
            <h3>Total: ${cart.totalPrice}</h3>
            <button onClick={checkout} style={{ backgroundColor: '#27ae60', marginTop: '10px', width: '100%', padding: '15px' }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
