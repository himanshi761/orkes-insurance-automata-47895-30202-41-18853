import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
dotenv.config()
let port=8000;
let app=express();

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed ❌", err);
  });

