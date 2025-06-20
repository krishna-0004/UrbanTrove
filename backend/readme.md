backend/
├── app.mjs
├── index.mjs
├── .env
├── package.json
├── config/
│   ├── db.mjs
│   └── passport.mjs
├── controllers/
│   ├── authController.mjs
│   ├── productController.mjs   ✅ NEW
│   └── reviewController.mjs    ✅ (Optional: for testimonials)
├── routes/
│   ├── authRoutes.mjs
│   └── productRoutes.mjs       ✅ NEW
├── middleware/
│   └── authMiddleware.mjs
├── model/
│   ├── User.mjs
│   ├── Product.mjs
│   └── Review.mjs              ✅ REQUIRED for testimonials
├── utils/
│   └── generateToken.mjs
├── data/
│   └── product.js
