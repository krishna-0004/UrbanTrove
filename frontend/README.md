frontend/
├── public/
│   └── index.html
│
├── src/
│
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProtectedRoute.jsx      # ✅ Already exists — we'll now implement it
│   │   └── Profile.jsx             # ✅ NEW: Modular user profile component
│
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│
│   ├── context/
│   │   ├── AuthContext.jsx         # ✅ We'll implement logic for login state here
│
│   ├── hooks/
│   │   └── useAuth.js              # ✅ NEW: Hook for auth status, user info, logout
│
│   ├── services/
│   │   └── authService.js          # ✅ NEW (optional): Wrapper for login/logout/profile API
│
│   ├── utils/
│   │   └── tokenHelper.js          # ❌ Not needed for cookie-based auth (skip this)
│
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── vite.config.js
├── package.json
└── README.md
