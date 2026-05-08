const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connect");

const superAdminRoutes = require("./routes/superAdmin");
const adminRoutes = require("./routes/admin");
const flagsRoutes = require("./routes/flags");

const app = express();

// ── Middleware ─────────────────────────────
app.use(cors());
app.use(express.json());

// ── Static Frontends ───────────────────────
app.use(
  "/super-admin",
  express.static(path.join(__dirname, "../frontend/super-admin"))
);
app.use(
  "/admin",
  express.static(path.join(__dirname, "../frontend/admin"))
);
app.use(
  "/user",
  express.static(path.join(__dirname, "../frontend/user"))
);

// Default route
app.get("/", (req, res) => {
  res.redirect("/user");
});

// ── API Routes ─────────────────────────────
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/flags", flagsRoutes);

// 404 API handler
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ── Global Error Handler ───────────────────
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── PORT SETUP (RENDER COMPATIBLE) ─────────
const PORT = process.env.PORT || 3000;

// ── START SERVER ───────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log("========================================");
      console.log("🚀 Feature Flag System Running");
      console.log(`🌐 Port: ${PORT}`);
      console.log("========================================");
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;