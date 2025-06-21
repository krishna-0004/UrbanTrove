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


import { ConnectDB } from "./config/db.mjs";

dotenv.config();
ConnectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("Server is running")
});
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
export default app;