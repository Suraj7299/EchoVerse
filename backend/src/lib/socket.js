import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173", // adjust as needed
			credentials: true,
		},
	});

	const userSockets = new Map();     // userId => socketId
	const userActivities = new Map();  // userId => activity

	io.on("connection", (socket) => {
		console.log(`🟢 Socket connected: ${socket.id}`);

		// User connected
		socket.on("user_connected", (userId) => {
			if (!userId) return;

			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			io.emit("user_connected", userId);
			socket.emit("users_online", Array.from(userSockets.keys()));
			io.emit("activities", Array.from(userActivities.entries()));
		});

		// Activity update
		socket.on("update_activity", ({ userId, activity }) => {
			if (!userId || !activity) return;

			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		// Send a message
		socket.on("send_message", async ({ senderId, receiverId, content }) => {
			if (!senderId || !receiverId || !content) {
				return socket.emit("message_error", "Invalid message payload.");
			}

			try {
				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				const receiverSocketId = userSockets.get(receiverId);

				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);
			} catch (error) {
				console.error("💥 Message error:", error.message);
				socket.emit("message_error", "Failed to send message.");
			}
		});

		// Disconnect handling
		socket.on("disconnect", () => {
			let disconnectedUserId;

			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}

			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
				console.log(`🔴 User disconnected: ${disconnectedUserId}`);
			}
		});
	});
};
