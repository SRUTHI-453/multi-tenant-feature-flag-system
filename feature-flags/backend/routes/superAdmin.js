const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { SUPER_ADMIN, JWT_SECRET, JWT_EXPIRES_IN } = require("../config");
const Organization = require("../models/Organization");
const { authenticate, requireRole } = require("../middleware/auth");

// POST /api/super-admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  if (
    email.toLowerCase() !== SUPER_ADMIN.email.toLowerCase() ||
    password !== SUPER_ADMIN.password
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: SUPER_ADMIN.id, email: SUPER_ADMIN.email, role: "super_admin" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  res.json({ token, role: "super_admin", email: SUPER_ADMIN.email });
});

// POST /api/super-admin/organizations
router.post("/organizations", authenticate, requireRole("super_admin"), async (req, res) => {
  const { name } = req.body;
  if (!name?.trim())
    return res.status(400).json({ error: "Organization name is required" });

  try {
    const org = await Organization.create({ name: name.trim() });
    res.status(201).json(org);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "Organization name already exists" });
    throw err;
  }
});

// GET /api/super-admin/organizations
router.get("/organizations", authenticate, requireRole("super_admin"), async (req, res) => {
  const orgs = await Organization.find().sort({ createdAt: -1 });
  res.json(orgs);
});

module.exports = router;
