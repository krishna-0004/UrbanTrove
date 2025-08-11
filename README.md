# UrbanTrove — E-commerce Platform

A MERN based e-commerce platform with features: catalog, cart, checkout, payments, admin, etc.

## Features
- Product catalog with search/filtering
- Shopping cart and checkout
- Payments via Razorpay
- Auth: JWT/OAuth
- Admin dashboard: orders/products/users
- SEO and performance optimizations

## Tech Stack
- Frontend: React
- Backend: Node/Express
- Database: MongoDB
- API: REST
- Infra: Vercel/Render

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Database MongoDB running locally.
- Git installed


git clone https://github.com/krishna-0004/UrbanTrove.git
cd <repo>
cp .env.example .env # add the environment variables
npm install

backend .env
PORT=<your_port>
MONGO_URI=<your_mongourl>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
CLOUDINARY_NAME=<your_cloudinary_name>
CLOUDINARY_KEY=<your_cloudinary_key>
CLOUDINARY_SECRET=<your_cloudinary_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
JWT_SECRET=<your_jwtsecretr>
GOOGLE_CALLBACK_URL=<your_google_callback_url>
EMAIL_USER=<your_email_user>
EMAIL_PASS=<your_email_pass>
FRONTEND_URL=<your_frontend_url>

frontend .env
VITE_API_URL=<your_vite_api_url>
VITE_RAZORPAY_KEY=<your_razorpay_key>
VITE_EMAILJS_SERVICE_ID=<your_emailjs_servece_id>
VITE_EMAILJS_TEMPLATE_ID=<your_emailjs_template_id>
VITE_EMAILJS_PUBLIC_KEY=<your_emailjs_public_key>


### Run Locally
development
npm run dev

start production server
npm start



---

## 📸 Screenshots
Home Page
<img width="1902" height="929" alt="image" src="https://github.com/user-attachments/assets/6ff5f5d9-6c27-4d1c-8b96-23d5b6ed9e51" />

Product Page
<img width="1898" height="928" alt="image" src="https://github.com/user-attachments/assets/00bce11e-a10a-4d22-aafe-a264efb84537" />

Product Detail
<img width="1895" height="931" alt="image" src="https://github.com/user-attachments/assets/637a4e70-f804-4028-bde9-416c259bb4b8" />


Cart Page
<img width="1891" height="930" alt="image" src="https://github.com/user-attachments/assets/bfac327f-e7cf-4bc5-839f-24e6e65a425a" />

Admin Dashboard
<img width="1898" height="972" alt="image" src="https://github.com/user-attachments/assets/c6985eff-442f-426f-88de-2d14f387967a" />

---


## 🙌 Acknowledgements
- Inspired by popular commerce platforms
- Icons from [[React-Icon](https://react-icons.github.io/react-icons/)]
- UI components with Tailwind CSS
