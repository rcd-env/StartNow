import app from "./app.js";
import { connectDB } from "./db/connectDB.js";
import express from "express";

import authRouter from "./routes/auth.route.js";

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {})
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server Started");
});
app.use("/auth/", authRouter);

app.all("/*path", (req, res) => {
  res.status(404).json({
    status: 400,
    message: "Page Not Found",
  });
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error  " } = err;
  res.status(statusCode).json({
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
