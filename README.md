# HonestCart - Full-Stack Marketplace Platform

A complete e-commerce marketplace built with **Node.js + Express** (Backend), **React + Vite** (Frontend), and **React Native + Expo** (Mobile App).

---

## 📋 Project Structure

```
HonestCart App/
├── backend/          # Node.js Express API server
├── frontend/         # React web application
├── mobile/           # React Native Expo app
└── package.json      # Root configuration
```

---

## 🏗️ Architecture Overview

### **1. BACKEND (Node.js + Express)**
**Location:** `backend/`
**Port:** 5000

#### What it does:
- Handles all API requests from web and mobile apps
- Manages user authentication (signup/login)
- Processes product listings and management
- Manages shopping cart and orders
- Connects to MongoDB database

#### Key Technologies:
- **Express.js** - Web framework for handling HTTP requests
- **MongoDB + Mongoose** - NoSQL database for storing data
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password encryption for security
- **CORS** - Allow frontend/mobile to communicate with backend

#### Core Features:
1. **Authentication** (`/api/auth`)
   - User signup with email & password
   - User login with email & password
   - JWT tokens for secure sessions

2. **User Management** (`/api/users`)
   - Get user profile
   - Update profile information
   - Become a seller

3. **Products** (`/api/products`)
   - Browse all products
   - Search products by name
   - Sellers add/edit/delete products
   - View product details

4. **Shopping Cart** (`/api/cart`)
   - Add items to cart
   - Remove items from cart
   - Clear entire cart
   - View cart with total price

5. **Orders** (`/api/orders`)
   - Create orders from cart
   - View order history
   - Track order status
   - Update order status (for sellers)

---

### **2. FRONTEND (React + Vite)**
**Location:** `frontend/`
**Port:** 3000

#### What it does:
- Beautiful web interface for buyers and sellers
- Real-time communication with backend API
- Responsive design for desktop and tablets

#### Key Technologies:
- **React** - JavaScript library for building UIs
- **Vite** - Fast build tool for development
- **React Router** - Navigation between pages
- **Axios** - HTTP client for API calls
- **CSS** - Styling components

#### Pages:
1. **Home** (`/`)
   - Landing page with features
   - CTA button to browse products

2. **Login** (`/login`)
   - Email and password input
   - JWT token stored in localStorage
   - Redirect on success

3. **Signup** (`/signup`)
   - Create new account
   - Auto-login after signup
   - Store user info locally

4. **Products** (`/products`)
   - Browse all products
   - Search products
   - Add to cart button
   - Product cards with price & stock

5. **Cart** (`/cart`)
   - View all items in cart
   - See total price
   - Remove items
   - Checkout button (placeholder)

6. **Profile** (`/profile`)
   - View user information
   - Edit profile details
   - "Become a Seller" button
   - View seller store info

7. **Seller Dashboard** (`/seller-dashboard`)
   - Add new products
   - Edit existing products
   - Delete products
   - View all your products

#### How Authentication Works:
```javascript
// When user logs in:
1. Enter email & password
2. Backend validates & creates JWT token
3. Token stored in localStorage as 'token'
4. Token sent with every request in Authorization header
5. Logout removes token from localStorage
```

---

### **3. MOBILE (React Native + Expo)**
**Location:** `mobile/`

#### What it does:
- Native iOS/Android app using same backend API
- Touch-optimized UI
- Can be run on physical devices or emulators

#### How to use:
```bash
cd mobile
npm install --legacy-peer-deps
npm start

# Then:
# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for web preview
```

---

## 🗄️ Database Models

### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (encrypted),
  role: 'buyer' | 'seller' | 'admin',
  phone: String,
  address: {
    street, city, state, zipCode, country
  },
  isSeller: Boolean,
  sellerInfo: {
    storeName, description, logo, rating
  }
}
```

### **Product Model**
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  seller: ObjectId (ref to User),
  images: [String],
  stock: Number,
  rating: Number,
  tags: [String],
  isActive: Boolean
}
```

### **Order Model**
```javascript
{
  buyer: ObjectId (ref to User),
  items: [{
    product: ObjectId,
    seller: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  shippingAddress: { street, city, state, zipCode, country },
  paymentInfo: { method, transactionId, status },
  trackingNumber: String
}
```

### **Cart Model**
```javascript
{
  user: ObjectId (ref to User, unique),
  items: [{
    product: ObjectId (ref to Product),
    quantity: Number,
    addedAt: Date
  }],
  totalPrice: Number
}
```

---

## 🚀 Getting Started

### **Prerequisites:**
- Node.js v14+ installed
- MongoDB running (local or cloud)
- Git configured

### **Setup Backend:**
```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/honestcart
# JWT_SECRET=your_secret_key

# Start server
npm start
# Server runs on http://localhost:5000
```

### **Setup Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Open http://localhost:3000
```

### **Setup Mobile:**
```bash
cd mobile

# Install dependencies (may need --legacy-peer-deps)
npm install --legacy-peer-deps

# Start Expo
npm start

# Scan QR code with Expo Go app on phone
# OR press 'a' for Android / 'i' for iOS emulator
```

---

## 📡 API Endpoints Reference

### **Authentication**
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password

### **Users**
- `GET /api/users/profile` - Get current user info (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `POST /api/users/become-seller` - Upgrade to seller (auth required)

### **Products**
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (auth required, seller only)
- `PUT /api/products/:id` - Update product (auth required, owner only)
- `DELETE /api/products/:id` - Delete product (auth required, owner only)

### **Cart**
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `POST /api/cart/remove` - Remove item from cart (auth required)
- `POST /api/cart/clear` - Clear entire cart (auth required)

### **Orders**
- `POST /api/orders` - Create order from cart (auth required)
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)
- `PUT /api/orders/:id` - Update order status (auth required, seller only)

---

## 🔐 Security Features

1. **Password Encryption** - bcryptjs hashes all passwords
2. **JWT Authentication** - Secure token-based sessions
3. **Protected Routes** - Auth middleware checks every request
4. **Validation** - Input validation on all endpoints
5. **CORS** - Cross-origin requests configured safely

---

## 📂 File Organization

### Backend Structure:
```
backend/
├── server.js           # Main entry point
├── .env                # Environment variables
├── models/             # Database schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   └── Review.js
├── routes/             # API endpoints
│   ├── auth.js
│   ├── products.js
│   ├── users.js
│   ├── orders.js
│   └── cart.js
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   └── cartController.js
├── middleware/         # Auth & validation
│   └── auth.js
└── package.json
```

### Frontend Structure:
```
frontend/
├── index.html          # Main HTML file
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main component with routing
│   ├── index.css       # Global styles
│   ├── components/     # Reusable components
│   │   └── Navbar.jsx
│   └── pages/          # Page components
│       ├── Home.jsx
│       ├── Login.jsx
│       ├── Signup.jsx
│       ├── Products.jsx
│       ├── Cart.jsx
│       ├── Profile.jsx
│       └── SellerDashboard.jsx
└── package.json
```

---

## 🔄 How Data Flows

### **Example: User Buys a Product**

1. **Frontend (React)**
   - User clicks "Add to Cart" button
   - React sends POST request to `/api/cart/add`

2. **Backend (Express)**
   - Route handler receives request
   - Auth middleware validates JWT token
   - Controller adds product to cart
   - MongoDB updates cart document
   - Response sent back with updated cart

3. **Frontend (React)**
   - Receives response
   - Shows "Added to cart!" message
   - Updates UI to reflect cart state

4. **Repeat for checkout**
   - User reviews cart
   - Clicks "Checkout"
   - Creates order from cart items
   - Cart cleared
   - Order appears in order history

---

## 🛠️ Development Workflow

### **Making Changes:**

1. **Update Backend API**
   - Edit files in `backend/controllers/`
   - Backend auto-reloads (nodemon in future)
   - Test with Postman or curl

2. **Update Frontend UI**
   - Edit files in `frontend/src/`
   - Vite auto-reloads browser
   - See changes instantly

3. **Test Locally**
   - Open http://localhost:3000
   - Create account
   - Browse products
   - Add to cart
   - Checkout

4. **Push to GitHub**
   - `git add .`
   - `git commit -m "Your message"`
   - `git push origin main`

---

## 📊 Current Status

✅ **Completed:**
- Backend API with all core endpoints
- Authentication system (JWT)
- User management
- Product management
- Shopping cart
- Order management
- Frontend web application
- React Router setup
- Mobile app scaffolding

⏳ **Next Steps:**
- Payment integration (Stripe/PayPal)
- Product reviews & ratings
- Seller analytics
- Email notifications
- Image uploads
- Testing suite
- Deployment (Heroku/AWS)

---

## 🚨 Environment Setup

### **Backend .env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/honestcart
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### **Frontend .env (optional):**
```env
VITE_API_URL=http://localhost:5000
```

---

## 📝 Git Workflow

```bash
# See what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "Feature: Add product review system"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## 🎯 Key Concepts Explained

### **JWT (JSON Web Token)**
- A secure token that proves user is logged in
- Sent with every request in header
- Cannot be forged (signed with secret key)
- Expires after set time (7 days default)

### **RESTful API**
- GET = retrieve data
- POST = create data
- PUT = update data
- DELETE = remove data

### **Middleware**
- Functions that run before route handlers
- Example: Check if user is authenticated
- Can modify request or response

### **Routes**
- Define which URLs do what
- Example: `/api/products` shows products
- Each route has controller with business logic

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push and create pull request
4. Review and merge

---

## 📞 Support

For issues or questions:
1. Check GitHub issues
2. Review code comments
3. Check documentation above
4. Ask in team chat

---

**Built with ❤️ for HonestCart Marketplace**
