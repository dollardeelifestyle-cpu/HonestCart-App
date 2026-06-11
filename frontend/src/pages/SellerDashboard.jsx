import { useState, useEffect } from 'react'
import axios from 'axios'

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
  })
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(res.data.products)
    } catch (err) {
      console.error('Failed to fetch products')
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFormData({ name: '', description: '', price: '', category: 'Electronics', stock: '' })
      setShowAddForm(false)
      fetchMyProducts()
      alert('Product added!')
    } catch (err) {
      alert('Failed to add product')
    }
  }

  const deleteProduct = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchMyProducts()
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Seller Dashboard</h2>
      
      <button 
        onClick={() => setShowAddForm(!showAddForm)}
        style={{ marginBottom: '20px', backgroundColor: '#27ae60' }}
      >
        {showAddForm ? 'Cancel' : 'Add New Product'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddProduct} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '30px', borderRadius: '8px' }}>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', marginBottom: '10px', minHeight: '100px' }}
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit" style={{ backgroundColor: '#27ae60', width: '100%' }}>Add Product</button>
        </form>
      )}

      <h3>My Products ({products.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h4>{product.name}</h4>
            <p>${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button 
              onClick={() => deleteProduct(product._id)}
              style={{ backgroundColor: '#e74c3c', marginTop: '10px', width: '100%' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
