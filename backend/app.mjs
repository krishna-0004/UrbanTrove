import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import "./config/passport.mjs";
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.mjs";
import productRoutes from "./routes/productRoutes.mjs";
import wishlistRoutes from "./routes/wishlistRoutes.mjs";
import cartRoutes from "./routes/cartRoutes.mjs";
import reviewRoutes from "./routes/reviewRoutes.mjs";
import paymentRoutes from "./routes/paymentRoutes.mjs"
import orderRoutes from "./routes/orderRoutes.mjs";
import adminRoutes from "./routes/adminRoutes.mjs"
import adminproductRoutes from "./routes/adminProductRoutes.mjs";
import adminorderRoutes from "./routes/adminOrderRoutes.mjs";
import adminAnalyticsRoutes from './routes/adminAnalyticsRoutes.mjs';

import { ConnectDB } from "./config/db.mjs";

dotenv.config();
ConnectDB();

const app = express();

app.set("trust proxy", 1);



app.use(cors({
  origin: ["http://localhost:5173", "https://urban-trove.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("Server is running")
});
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/product", adminproductRoutes);
app.use("/api/admin/order", adminorderRoutes)
app.use("/api/admin/analytics", adminAnalyticsRoutes);

export default app;