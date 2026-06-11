import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      fetchProfile()
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
    } catch (err) {
      console.error('Failed to fetch profile')
    }
    setLoading(false)
  }

  const becomeSeller = async () => {
    try {
      await axios.post('/api/users/become-seller', 
        { storeName: 'My Store' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProfile()
      alert('You are now a seller!')
    } catch (err) {
      alert('Failed to become seller')
    }
  }

  if (loading) return <p>Loading...</p>
  if (!token) return <p>Please login to view your profile</p>
  if (!user) return <p>Profile not found</p>

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Profile</h2>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
        
        {!user.isSeller && (
          <button onClick={becomeSeller} style={{ marginTop: '20px', backgroundColor: '#3498db' }}>
            Become a Seller
          </button>
        )}
        
        {user.isSeller && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#d5f4e6', borderRadius: '5px' }}>
            <h3>Store Info</h3>
            <p><strong>Store Name:</strong> {user.sellerInfo?.storeName}</p>
            <p><strong>Rating:</strong> {user.sellerInfo?.rating || 0}</p>
          </div>
        )}
      </div>
    </div>
  )
}
