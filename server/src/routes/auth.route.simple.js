import express from "express";
import passport from "../config/passport.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import {
  signup,
  login,
  getMe,
  googleCallback,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router({ mergeParams: true });

// Email/Password Authentication Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Routes (JWT Required)
router.get("/me", authenticateJWT, getMe);
router.put("/profile", authenticateJWT, updateProfile);
router.post("/logout", logout);

// Error route for OAuth failures
router.get("/error", (req, res) => {
  res.status(400).json({
    success: false,
    message: "Authentication failed. Please try again.",
  });
});

export default router;
