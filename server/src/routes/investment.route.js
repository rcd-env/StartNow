import express from "express";
import {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestmentStatus,
  getUserInvestments,
  getInvestmentStats,
} from "../controllers/investment.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/stats", getInvestmentStats);

// Protected routes
router.get("/", authenticateJWT, getInvestments);
router.get("/my", authenticateJWT, getUserInvestments);
router.get("/:id", authenticateJWT, getInvestment);
router.post("/", authenticateJWT, createInvestment);
router.put("/:id/status", authenticateJWT, updateInvestmentStatus);

export default router;
