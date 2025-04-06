import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";      
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stat.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songRoutes);
app.use("api/albums",albumRoutes);
app.use("/api/stats",statsRoutes);

 app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});