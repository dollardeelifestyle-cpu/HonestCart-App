import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async (query = '') => {
    setLoading(true)
    try {
      const url = query ? `/api/products?search=${query}` : '/api/products'
      const res = await axios.get(url)
      setProducts(res.data.products)
    } catch (err) {
      console.error('Failed to fetch products')
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    if (e.target.value) {
      fetchProducts(e.target.value)
    } else {
      fetchProducts()
    }
  }

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first')
      return
    }
    try {
      await axios.post('/api/cart/add', { productId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Added to cart!')
    } catch (err) {
      alert('Failed to add to cart')
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Browse Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearch}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <div key={product._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p style={{ fontSize: '1.5rem', color: '#27ae60', fontWeight: 'bold' }}>
                ${product.price}
              </p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => addToCart(product._id)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
