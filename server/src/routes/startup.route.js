import express from "express";
import {
  getStartups,
  getStartup,
  createStartup,
  updateStartup,
  deleteStartup,
  getStartupsByFounder,
} from "../controllers/startup.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getStartups);
router.get("/:id", getStartup);
router.get("/founder/:founderId", getStartupsByFounder);

// Protected routes
router.post("/", authenticateJWT, createStartup);
router.put("/:id", authenticateJWT, updateStartup);
router.delete("/:id", authenticateJWT, deleteStartup);

export default router;
