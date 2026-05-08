const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connect");
const { PORT } = require("./config");

const superAdminRoutes = require("./routes/superAdmin");
const adminRoutes = require("./routes/admin");
const flagsRoutes = require("./routes/flags");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Static Frontends ──────────────────────────────────────────────────────────
app.use("/super-admin", express.static(path.join(__dirname, "../frontend/super-admin")));
app.use("/admin",       express.static(path.join(__dirname, "../frontend/admin")));
app.use("/user",        express.static(path.join(__dirname, "../frontend/user")));
app.get("/", (req, res) => res.redirect("/user"));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin",       adminRoutes);
app.use("/api/flags",       flagsRoutes);

app.use("/api", (req, res) => res.status(404).json({ error: "API route not found" }));

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║   Feature Flag Management System (MongoDB)       ║
║   http://localhost:${PORT}                           ║
╠══════════════════════════════════════════════════╣
║   Super Admin  →  /super-admin                   ║
║   Org Admin    →  /admin                         ║
║   End User     →  /user                          ║
╠══════════════════════════════════════════════════╣
║   Super Admin Login:                             ║
║   Email:  superadmin@flagsys.io                  ║
║   Pass:   Admin@1234                             ║
╚══════════════════════════════════════════════════╝
    `);
  });
});

module.exports = app;
