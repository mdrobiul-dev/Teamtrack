const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const boardRoutes = require("./routes/board.routes");
const listRoutes = require("./routes/list.routes");
const taskRoutes = require("./routes/task.routes");
const activityRoutes = require("./routes/activity.routes");

const app = express();
const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL is missing. Add it to backend/.env");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);

async function startServer() {
  try {
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully");
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);

    if (err.name === "MongooseServerSelectionError") {
      console.error("\n💡 Troubleshooting tips:");
      console.error("   • Make sure your IP is whitelisted in MongoDB Atlas Network Access");
      console.error("   • Try adding 0.0.0.0/0 temporarily for development");
      console.error("   • Check your MONGO_URL in .env");
    }

    process.exit(1);
  }
}

startServer();
