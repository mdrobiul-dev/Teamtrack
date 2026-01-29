const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// this is all the routes 
const authRoutes = require("./routes/auth.routes");
const workspaceRoutes  = require("./routes/workspace.routes")
const protected = require("./middlewear/auth.middleware");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


// this is all the routes 
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes)

app.get("/api/private", protected, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    userId: req.user.id,
  });
});

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
