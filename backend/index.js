import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
dotenv.config()
let port=process.env.PORT || 6000
let app=express();
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
app.listen(port,()=>{
    console.log("Hello from server")
    connectDB()
})

