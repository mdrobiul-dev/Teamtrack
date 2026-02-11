const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// this is all the routes
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const boardRoutes = require("./routes/board.routes");
const listRoutes = require("./routes/list.routes");
const taskRoutes = require("./routes/task.routes");
const activityRoutes = require("./routes/activity.routes");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// this is all the routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });
