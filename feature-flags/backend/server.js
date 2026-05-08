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
app.use("/super-admin", express.static(path.join(__dirname, "../frontend/super-admin")));
app.use("/admin", express.static(path.join(__dirname, "../frontend/admin")));
app.use("/user", express.static(path.join(__dirname, "../frontend/user")));

// Default route
app.get("/", (req, res) => {
  res.redirect("/user");
});

// ── API Routes ─────────────────────────────
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/flags", flagsRoutes);

// 404 handler for API
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ── Global Error Handler ───────────────────
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── PORT SETUP (IMPORTANT FOR RENDER) ─────
const PORT = process.env.PORT || 3000;

// ── START SERVER ───────────────────────────
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
      console.log(`
========================================
🚀 Feature Flag System Running
🌐 Port: ${PORT}
========================================
      `);
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

// optional export (useful for testing)
module.exports = app;