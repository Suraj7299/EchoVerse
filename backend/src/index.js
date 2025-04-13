import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Use HTTP server for both Express and Socket.IO
const httpServer = createServer(app);

// ✅ Initialize Socket.IO with CORS correctly
initializeSocket(httpServer);

// ✅ CORS setup - allow all origins (for dev)
app.use(
	cors({
		origin: "*", // Use "*" only for development. In production, specify domains.
		credentials: true,
	})
);

// ✅ Middleware
app.use(express.json());
app.use(clerkMiddleware());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10 MB max
		},
	})
);

// ✅ Clean up temp folder hourly
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) return console.error(err);
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), () => {});
			}
		});
	}
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("/*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// ✅ Error handler
app.use((err, req, res, next) => {
	res.status(500).json({
		message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
	});
});

// ✅ Start server
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	connectDB();
});
