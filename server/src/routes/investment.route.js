import express from "express";
import {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestmentStatus,
  getUserInvestments,
  getInvestmentStats,
  // Blockchain/Aptos specific functions
  createBlockchainPitch,
  processAptosInvestment,
  completeMilestone,
  releaseFunds,
  processRefund,
  getBlockchainPitch,
  getTransactionLogs,
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

// ============ BLOCKCHAIN/APTOS ROUTES ============

// Blockchain pitch management
router.post("/blockchain/pitch", createBlockchainPitch);
router.get("/blockchain/pitch/:startupId", getBlockchainPitch);

// Investment processing
router.post("/blockchain/invest", processAptosInvestment);

// Milestone management
router.post("/blockchain/milestone/complete", completeMilestone);

// Fund management
router.post("/blockchain/funds/release", releaseFunds);
router.post("/blockchain/refund", processRefund);

// Transaction logs
router.get("/blockchain/logs", getTransactionLogs);

export default router;
