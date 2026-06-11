# Code Explanations & Development Guide

## 📌 Backend Code Walkthrough

### **1. Server.js - The Main Entry Point**

```javascript
require('dotenv').config();
```
- Loads environment variables from `.env` file
- Allows us to use `process.env.PORT`, `process.env.MONGODB_URI`, etc.

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
```
- Import required packages
- **express**: Web framework for handling HTTP requests
- **cors**: Enable frontend to communicate with backend
- **mongoose**: Library to interact with MongoDB

```javascript
const app = express();
```
- Create Express application instance
- This `app` will handle all HTTP requests

```javascript
app.use(express.json());
app.use(cors());
```
- **express.json()**: Parse incoming request bodies as JSON
- **cors()**: Allow requests from different origins (frontend on port 3000 can call backend on port 5000)

```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));
```
- Connect to MongoDB database
- If successful, print confirmation
- If fails, print error message

```javascript
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
```
- Mount route handlers
- Any request to `/api/auth/*` goes to auth router
- Any request to `/api/users/*` goes to users router

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```
- Start server on port (default 5000)
- Print message when server is ready

---

### **2. Authentication Controller - How Login Works**

```javascript
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
```
- Extract email and password from request body
- User sends: `{ email: "user@example.com", password: "123456" }`

```javascript
    const user = await User.findOne({ email }).select('+password');
```
- Find user by email in database
- `.select('+password')` includes password field (normally hidden for security)

```javascript
    const isPasswordValid = await user.matchPassword(password);
```
- Compare entered password with stored (encrypted) password
- `matchPassword()` method is defined in User model

```javascript
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
```
- Create JWT token with user ID
- Token is signed with secret key
- Token expires in 7 days (from .env)

```javascript
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
```
- Send token and user info back to frontend
- Frontend stores token in localStorage

---

### **3. Product Controller - How Products Work**

```javascript
const getAllProducts = async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
```
- Extract filter options from URL query string
- Example URL: `/api/products?search=laptop&page=1`
- `category`: Filter by category (optional)
- `search`: Search by product name (optional)
- `page`: Pagination page number (default 1)
- `limit`: Products per page (default 10)

```javascript
  let query = { isActive: true };
  
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
```
- Build MongoDB query
- Only show active products
- Filter by category if provided
- Search products by name (case-insensitive with `$regex`)

```javascript
  const products = await Product.find(query)
    .populate('seller', 'name email sellerInfo')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
```
- Find products matching query
- `.populate('seller')`: Replace seller ID with actual seller data
- `.skip()`: Skip previous pages (page 1 skips 0, page 2 skips 10, etc.)
- `.limit()`: Return max 10 products

```javascript
  const count = await Product.countDocuments(query);
  
  res.json({
    products,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    total: count,
  });
```
- Count total products matching query
- Return products with pagination info
- Frontend can show "Page 1 of 5"

---

### **4. Cart Controller - How Shopping Cart Works**

```javascript
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
```
- Get product ID and quantity from request
- Verify product exists in database
- If not found, send 404 error

```javascript
  let cart = await Cart.findOne({ user: req.userId });
  if (!cart) {
    cart = new Cart({ user: req.userId });
  }
```
- Find user's cart
- If doesn't exist, create new empty cart

```javascript
  const existingItem = cart.items.find(item => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
```
- Check if product already in cart
- If yes: increase quantity
- If no: add new item to cart

```javascript
  cart.totalPrice = 0;
  for (const item of cart.items) {
    const prod = await Product.findById(item.product);
    cart.totalPrice += prod.price * item.quantity;
  }
  
  await cart.save();
  res.json({ message: 'Item added to cart', cart });
```
- Recalculate total price
- Loop through all items: multiply price × quantity
- Save cart to database
- Send updated cart back to frontend

---

## 🎨 Frontend Code Explanations

### **1. App.jsx - Main React Component**

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
```
- Import routing components
- **Router**: Enables client-side routing
- **Routes**: Container for all route definitions
- **Route**: Maps URL path to component

```javascript
function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
    </Router>
  )
}
```
- **\<Navbar />**: Shows navigation on every page
- **\<Routes>**: Container for all page definitions
- **\<Route path="/" element={<Home />} />**: When user visits `/`, show Home component
- This is **Client-Side Routing** - pages load without full page refresh

---

### **2. Login.jsx - Authentication Page**

```javascript
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
```
- **State variables** - store form data and errors
- When user types in input, we update state
- When error occurs, we display it

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const res = await axios.post('/api/auth/login', { email, password })
```
- `async`: This function waits for API response
- `axios.post()`: Send POST request to backend
- Send email and password to `/api/auth/login`

```javascript
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  navigate('/')
```
- **localStorage**: Browser storage (persists after page refresh)
- Store JWT token for future requests
- Store user info (name, email, role)
- Redirect to home page using `navigate()`

```javascript
catch (err) {
  setError(err.response?.data?.message || 'Login failed')
}
```
- If API call fails, show error message
- `err.response?.data?.message`: Custom error from backend
- `|| 'Login failed'`: Fallback error if no specific message

---

### **3. Products.jsx - Product Listing Page**

```javascript
const [products, setProducts] = useState([])
const [search, setSearch] = useState('')
```
- **products**: Array of all products to display
- **search**: Current search term user typed

```javascript
useEffect(() => {
  fetchProducts()
}, [])
```
- `useEffect()`: Run code when component mounts
- Empty dependency `[]`: Run only once when page loads
- Fetch products when page loads

```javascript
const fetchProducts = async (query = '') => {
  const url = query ? `/api/products?search=${query}` : '/api/products'
  const res = await axios.get(url)
  setProducts(res.data.products)
}
```
- Get products from backend
- If search term provided: add it to URL (e.g., `?search=laptop`)
- Backend filters and returns matching products
- Update state with products

```javascript
const addToCart = async (productId) => {
  const token = localStorage.getItem('token')
  
  await axios.post('/api/cart/add', 
    { productId, quantity: 1 }, 
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
```
- Get token from localStorage
- Send token in Authorization header with `Bearer` prefix
- Backend checks token to verify user
- If valid, add product to cart

---

### **4. Cart.jsx - Shopping Cart Display**

```javascript
const [cart, setCart] = useState(null)

useEffect(() => {
  if (token) {
    fetchCart()
  }
}, [token])
```
- Fetch cart when component loads
- Only if user is logged in (has token)

```javascript
const fetchCart = async () => {
  const res = await axios.get('/api/cart', {
    headers: { Authorization: `Bearer ${token}` }
  })
  setCart(res.data)
}
```
- Send request with auth token
- Backend returns user's cart items
- Update state to trigger re-render

```javascript
{cart.items.map(item => (
  <div key={item.product._id}>
    <h3>{item.product.name}</h3>
    <p>Quantity: {item.quantity}</p>
    <p>${item.product.price * item.quantity}</p>
  </div>
))}
```
- `.map()`: Loop through cart items
- For each item, display product info
- Calculate price: `price × quantity`
- `key={item.product._id}`: React uses key to track items

---

## 🔐 Security Explained

### **How Passwords Are Stored**

```javascript
// User enters password: "myPassword123"
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```
- Before saving to database, **hash** the password
- **Hashing**: One-way encryption - can't decrypt to get original
- **Salt**: Random characters added for extra security
- Database stores: `$2a$10$k9K0A.3X0C...` (not actual password)

### **How Login Authentication Works**

```javascript
// User tries to login with password: "myPassword123"
const isPasswordValid = await user.matchPassword(password);

// Method compares entered password with stored hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```
- `bcrypt.compare()`: Compare entered password with stored hash
- If they match (same password), returns `true`
- If different, returns `false`

### **How JWT Works**

```javascript
// Create token when user logs in
const token = jwt.sign(
  { id: user._id },           // Payload (data inside token)
  process.env.JWT_SECRET,     // Secret key (only server knows)
  { expiresIn: process.env.JWT_EXPIRE }  // Expires in 7 days
);
```
- **Token** = Payload + Signature
- Signature is created using secret key
- No one can fake token without knowing secret key
- Token expires after 7 days

```javascript
// When user makes request, verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Now we know which user this is
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```
- Extract token from request header
- **jwt.verify()**: Verify signature is valid
- If valid, extract user ID and continue
- If invalid, reject request

---

## 🔄 Data Flow Examples

### **Example: User Adds Product to Cart**

```
1. FRONTEND (React)
   - User clicks "Add to Cart" button
   - Button calls: addToCart(productId)
   - Sends: POST /api/cart/add { productId, quantity: 1 }
   - Header: Authorization: Bearer <token>

2. BACKEND (Express)
   - Route handler receives request
   - Auth middleware checks token
   - Controller finds user's cart (or creates new)
   - Checks if product already in cart
   - Updates quantity or adds new item
   - Recalculates total price
   - Saves to MongoDB
   - Sends back: { message, cart }

3. FRONTEND (React)
   - Receives successful response
   - Shows "Added to cart!" alert
   - State updates with new cart data
   - UI re-renders to show new item

4. DATABASE (MongoDB)
   - Cart document updated with new item
   - Stored on disk
   - Persists even if server restarts
```

### **Example: User Searches for Products**

```
1. FRONTEND (React)
   - User types "laptop" in search box
   - onChange handler calls: handleSearch("laptop")
   - Calls: fetchProducts("laptop")
   - Sends: GET /api/products?search=laptop

2. BACKEND (Express)
   - Route extracts search parameter: "laptop"
   - Builds MongoDB query: { name: /laptop/i, isActive: true }
   - Finds all products with "laptop" in name
   - Populates seller info (replaces seller ID with seller object)
   - Returns: [ { _id, name, price, seller }, ... ]

3. FRONTEND (React)
   - Receives array of products
   - Updates products state: setProducts(products)
   - React re-renders page
   - .map() loop displays each product as a card

4. USER SEES
   - Product list filtered to show only "laptop" products
   - Can click on any to add to cart
```

---

## 📊 Database Relationships

```
User (1) ──── (Many) Product
│
├── Created products
└── Information stored: name, email, password, address, seller info

User (1) ──── (1) Cart
│
└── Shopping cart with items

User (1) ──── (Many) Order
│
└── Order history

Order (1) ──── (Many) Items
│
└── Each item references a Product and Seller

Product (1) ──── (Many) Review
│
└── Reviews left by buyers
```

---

## 🚀 How to Test Locally

### **Test Backend API with curl:**

```bash
# Test health check
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
# Returns: { token: "..." }

# Test get products (no auth needed)
curl http://localhost:5000/api/products

# Test get profile (needs auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/profile
```

### **Test Frontend:**
1. Open http://localhost:3000
2. Click "Signup"
3. Create account (email: test@example.com, password: 123456)
4. Auto-redirects to home
5. Click "Products"
6. See products (currently empty)
7. Click "Profile" to see your info
8. Click "Become a Seller"
9. Go to "Seller Dashboard"
10. Add a product
11. View it in "Products" page
12. Add to cart
13. Check cart

---

## 🐛 Common Issues & Solutions

**"MongoDB error: connection refused"**
- MongoDB isn't running
- Start MongoDB: `mongod`
- Or use MongoDB Atlas cloud version

**"CORS error in browser console"**
- Backend CORS not configured
- Check: `app.use(cors())` is in server.js
- Restart backend server

**"Token is invalid"**
- JWT_SECRET changed
- Token expired (> 7 days old)
- Browser console: Clear localStorage, login again

**"Cannot find module"**
- Dependencies not installed
- Run: `npm install`
- Check node_modules folder exists

---

This guide covers all the major code concepts!
