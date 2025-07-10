import express from "express";
import passport from "passport";
import {
  googleAuthSuccess,
  googleAuthFailure,
  logoutUser,
} from "../controllers/authController.mjs";
import { protect } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

router.get("/logout", logoutUser);

router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
