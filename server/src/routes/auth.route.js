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

// Google OAuth Routes (only if configured)
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== "your_google_client_id_here"
) {
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
      failureRedirect: "/auth/error",
      session: false,
    }),
    googleCallback
  );
} else {
  // Fallback routes when Google OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(503).json({
      success: false,
      message: "Google OAuth is not configured on this server",
    });
  });

  router.get("/google/callback", (req, res) => {
    res.status(503).json({
      success: false,
      message: "Google OAuth is not configured on this server",
    });
  });
}

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
