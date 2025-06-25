import jwt from "jsonwebtoken";
import User from "../model/User.mjs";

export const protect = async( req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({ message: "Not authorized, token not found "});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({ message: "Not Authorized, token invalid "});
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user?.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Access denied: Admins only" });
};