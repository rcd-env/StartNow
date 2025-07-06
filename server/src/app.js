import express from "express";
import cors from "cors";
import passport from "./config/passport.js";

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://start-now-xi.vercel.app",
  "https://start-now-git-main-rakesh-das-projects-709cd99d.vercel.app/",
  "https://start-pezhho6mc-rakesh-das-projects-709cd99d.vercel.app/",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Passport
app.use(passport.initialize());

export default app;
