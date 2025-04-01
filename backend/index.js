import express from 'express'
import { connectDB } from './db/connectDB.js';
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';

dotenv.config(); // using this to make sure application can use .env file
const PORT = process.env.PORT || 8000
const app = express();
const _dirname= path.resolve();
app.use(cors({origin:"http://localhost:5173",credentials:true}))

app.use(express.json()); // allows us to parse incoming request: req.body
app.use(cookieParser()); // allow us to parse incoming token
app.use("/api/auth",authRoutes)
if(process.env.NODE_ENV === "production"){
      app.use(express.static(path.join(_dirname,"/frontend/dist")));
      app.get("*", (req,res) => {
            res.sendFile(path.resolve(_dirname, "frontend","dist","index.html")); // D:\study\PROJECT\AuthenticationPractice\frontend\dist\index.html
      })
}
app.listen(PORT, () => {
      connectDB();
      console.log(`Server is running on port ${PORT}`);
})
