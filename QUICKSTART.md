# 🚀 HonestCart - Quick Start Setup Guide

## ✅ What You Need Before Starting

1. **Node.js** - Download from nodejs.org (version 14+)
   - Includes npm (Node Package Manager)

2. **MongoDB** - Choose one:
   - **Local**: Download from mongodb.com/try/download/community
   - **Cloud**: Use MongoDB Atlas (free: mongodb.com/cloud/atlas)

3. **Git** - Download from git-scm.com (already configured ✅)

4. **Code Editor** - VS Code (https://code.visualstudio.com)

---

## 📦 Installation Steps

### **Step 1: Install MongoDB (if using local)**

**Windows:**
1. Download MongoDB Community Edition
2. Run installer, follow steps
3. MongoDB installs as service (auto-starts)
4. Verify: Open Command Prompt, type `mongod` - should connect without errors

**OR Use MongoDB Atlas (Cloud):**
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/honestcart`
5. Update `.env` file with this connection string

---

### **Step 2: Setup Backend**

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# Backend runs on http://localhost:5000
npm start
```

**What this does:**
- Installs: Express, MongoDB, JWT, password hashing
- Starts server on port 5000
- You should see: `🚀 Server running on port 5000`

**Test it:**
- Open browser: http://localhost:5000/api/health
- Should see: `{"status":"Server running"}`

---

### **Step 3: Setup Frontend (New Terminal)**

```bash
# Open new terminal/PowerShell window

# Navigate to frontend folder
cd frontend

# Install all dependencies
npm install

# Frontend runs on http://localhost:3000
npm run dev
```

**What this does:**
- Installs: React, Vite, React Router, Axios
- Starts dev server on port 3000
- Auto-reloads when you save files

**You should see:**
```
VITE v5.0.0 ready in 920 ms
Local:   http://localhost:3000/
```

---

### **Step 4: Open in Browser**

Go to: **http://localhost:3000**

You should see HonestCart homepage with:
- Navigation bar (Logo, Products, Cart, Login, Signup)
- Hero section with welcome message
- Features section with 4 benefits

---

## 🧪 Test the Full App

### **1. Test Signup**
```
1. Click "Signup" in top right
2. Enter:
   - Name: John Doe
   - Email: john@example.com
   - Password: 123456
3. Click "Sign Up"
4. Auto-redirects to home
5. Token saved in browser storage (localStorage)
```

### **2. Test Products**
```
1. Click "Products" in navigation
2. Page loads products (initially empty)
3. Note: No products yet - we need to be a seller to add them
```

### **3. Test Become Seller**
```
1. Click "Profile" in top right
2. Click "Become a Seller" button
3. Your role changes to "seller"
```

### **4. Add Product (as Seller)**
```
1. Click "Seller Dashboard" in navigation
2. Click "Add New Product" button
3. Fill form:
   - Product Name: Gaming Laptop
   - Description: High performance laptop
   - Price: 999.99
   - Stock: 5
4. Click "Add Product"
5. See success message
```

### **5. Browse & Buy**
```
1. Click "Products"
2. See your product listed
3. Click "Add to Cart"
4. See "Added to cart!" message
5. Click "Cart"
6. See product in cart with total price
7. "Proceed to Checkout" button (not implemented yet)
```

### **6. Test Logout**
```
1. Click "Logout" button
2. Token removed from browser
3. Auto-redirects to home
4. Navbar shows "Login" and "Signup" again
```

---

## 🔧 Understanding the .env File

**Backend .env** (`backend/.env`):
```env
PORT=5000
# Port server runs on

MONGODB_URI=mongodb://localhost:27017/honestcart
# Local MongoDB connection
# OR cloud: mongodb+srv://user:pass@cluster.mongodb.net/honestcart

JWT_SECRET=your_super_secret_key_change_this
# Secret key for creating/verifying JWT tokens
# Change this in production!

JWT_EXPIRE=7d
# Tokens expire after 7 days

NODE_ENV=development
# development or production
```

**To use MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/honestcart?retryWrites=true&w=majority
```

---

## 📱 Mobile App (Expo)

### **Install Mobile Dependencies**
```bash
cd mobile

# Install with legacy peer deps (required for compatibility)
npm install --legacy-peer-deps
```

### **Start Expo**
```bash
npm start
```

### **Run on Device/Emulator**
- **iOS Emulator**: Press `i`
- **Android Emulator**: Press `a`
- **Web Preview**: Press `w`
- **Physical Device**: Scan QR code with Expo Go app

---

## 📡 API Testing with Postman/curl

### **Create User (Signup)**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "123456"
  }'

# Response:
# {
#   "message": "User registered successfully",
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "user": {
#     "id": "507f1f77bcf86cd799439011",
#     "name": "John",
#     "email": "john@example.com",
#     "role": "buyer"
#   }
# }
```

### **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'

# Response includes: message, token, user info
```

### **Get All Products**
```bash
curl http://localhost:5000/api/products

# Response: { products: [...], totalPages: 1, currentPage: 1, total: 0 }
```

### **Get Profile (Requires Auth)**
```bash
# Replace TOKEN with actual JWT token from login
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/users/profile

# Response: { _id, name, email, role, phone, address, isSeller, ... }
```

### **Add Product (Requires Auth & Seller Role)**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High performance",
    "price": 999,
    "category": "Electronics",
    "stock": 5
  }'
```

---

## 🐛 Troubleshooting

### **"Cannot connect to MongoDB"**
**Problem:** MongoDB server isn't running
**Solution:**
```bash
# Windows: Start MongoDB service
# Or run: mongod

# If using cloud (Atlas):
# Check connection string in .env
# Make sure IP is whitelisted in Atlas
```

### **"Port 5000 already in use"**
**Problem:** Another process using port 5000
**Solution:**
```bash
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill process:
Stop-Process -Id <PID> -Force

# Or change PORT in backend/.env to 5001
```

### **"CORS error in browser"**
**Problem:** Frontend can't communicate with backend
**Solution:**
- Check backend server is running on http://localhost:5000/api/health
- Make sure `app.use(cors())` is in backend/server.js
- Restart both servers

### **"Module not found"**
**Problem:** Dependencies not installed
**Solution:**
```bash
# Backend:
cd backend && npm install

# Frontend:
cd frontend && npm install
```

### **"Token is invalid"**
**Problem:** JWT token expired or corrupted
**Solution:**
```javascript
// In browser console:
localStorage.clear()  // Clear all storage
// Then login again
```

### **"Database is empty"**
**Problem:** No products showing
**Solution:**
1. Become a seller (click Profile → Become a Seller)
2. Go to Seller Dashboard
3. Add a product
4. Go to Products to see it

---

## 📝 Project Layout

```
HonestCart App/
│
├── backend/
│   ├── server.js              ← Main server file
│   ├── .env                   ← Environment variables
│   ├── package.json
│   │
│   ├── models/                ← Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Review.js
│   │
│   ├── routes/                ← API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── users.js
│   │   ├── orders.js
│   │   └── cart.js
│   │
│   ├── controllers/           ← Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── cartController.js
│   │
│   └── middleware/            ← Authentication
│       └── auth.js
│
├── frontend/
│   ├── index.html             ← Main HTML
│   ├── vite.config.js         ← Vite configuration
│   ├── package.json
│   │
│   └── src/
│       ├── main.jsx           ← React entry
│       ├── App.jsx            ← Main component
│       ├── index.css          ← Global styles
│       │
│       ├── components/        ← Reusable components
│       │   └── Navbar.jsx
│       │
│       └── pages/             ← Page components
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── Products.jsx
│           ├── Cart.jsx
│           ├── Profile.jsx
│           └── SellerDashboard.jsx
│
├── mobile/
│   ├── App.jsx
│   ├── app.json
│   ├── package.json
│   └── src/                   ← Mobile components
│
├── .gitignore
├── package.json               ← Root config
├── README.md                  ← Full documentation
└── CODE_GUIDE.md              ← Code explanations
```

---

## 🚀 Development Workflow

### **Making Changes to Backend**

1. **Edit file** (e.g., `backend/controllers/productController.js`)
2. **Backend auto-reloads** (restart npm start if needed)
3. **Test with curl or frontend**

Example: Add email validation
```javascript
// backend/controllers/authController.js
const email = req.body.email;

// Add validation:
if (!email.includes('@')) {
  return res.status(400).json({ message: 'Invalid email' });
}
```

### **Making Changes to Frontend**

1. **Edit file** (e.g., `frontend/src/pages/Products.jsx`)
2. **Browser auto-refreshes** - see changes instantly
3. **No restart needed** ✨

Example: Change button color
```javascript
// frontend/src/pages/Products.jsx
<button 
  onClick={() => addToCart(product._id)} 
  style={{ backgroundColor: '#27ae60' }}  // Change color
>
  Add to Cart
</button>
```

### **Push to GitHub**

```bash
# From project root
git add .
git commit -m "Add email validation and improve UI"
git push origin main

# Check GitHub.com to see changes
```

---

## 📊 Common Tasks

### **Add a New Page**

1. Create `frontend/src/pages/NewPage.jsx`:
```javascript
export default function NewPage() {
  return <div>New Page Content</div>
}
```

2. Add route in `frontend/src/App.jsx`:
```javascript
import NewPage from './pages/NewPage'

<Route path="/newpage" element={<NewPage />} />
```

3. Add link in `frontend/src/components/Navbar.jsx`:
```javascript
<Link to="/newpage">New Page</Link>
```

### **Add a New API Endpoint**

1. Create controller in `backend/controllers/newController.js`
2. Create route in `backend/routes/new.js`
3. Mount route in `backend/server.js`: `app.use('/api/new', require('./routes/new'))`

---

## 🎓 Learning Resources

- **Express.js**: expressjs.com/docs
- **React**: react.dev
- **MongoDB**: mongodb.com/docs
- **JWT**: jwt.io
- **Vite**: vitejs.dev

---

## 💾 Backup Your Work

```bash
# Push to GitHub regularly
git add .
git commit -m "Work in progress"
git push origin main

# Your code is now backed up on GitHub
```

---

## 🎉 You're Ready!

**Summary of what you have:**
- ✅ Full Node.js backend with database
- ✅ React web app with 7 pages
- ✅ Authentication system (signup/login)
- ✅ Shopping cart functionality
- ✅ Product management (sellers)
- ✅ Mobile app foundation (Expo)
- ✅ Git version control
- ✅ GitHub repository

**Next Steps:**
1. Start the servers (follow steps above)
2. Test signup/login
3. Add products
4. Buy products
5. Explore the code
6. Make changes
7. Push to GitHub

---

**Happy Coding! 🚀**
