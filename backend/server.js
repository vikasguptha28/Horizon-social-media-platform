const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
  });

// Routes
app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/posts",
  require("./routes/postRoutes")
);

app.use(
  "/api/comments",
  require("./routes/commentRoutes")
);

// Start Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
