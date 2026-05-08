const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config");
const User = require("../models/User");
const Organization = require("../models/Organization");
const FeatureFlag = require("../models/FeatureFlag");
const { authenticate, requireRole } = require("../middleware/auth");

// POST /api/admin/signup
router.post("/signup", async (req, res) => {
  const { email, password, organizationId } = req.body;
  if (!email || !password || !organizationId)
    return res.status(400).json({ error: "email, password, and organizationId are required" });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  const org = await Organization.findById(organizationId);
  if (!org) return res.status(404).json({ error: "Organization not found" });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role: "org_admin", organization: organizationId });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "Email already registered" });
    throw err;
  }
});

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, organizationId: user.organization.toString() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  res.json({ token, role: user.role, email: user.email, organizationId: user.organization });
});

// GET /api/admin/flags
router.get("/flags", authenticate, requireRole("org_admin"), async (req, res) => {
  const flags = await FeatureFlag.find({ organization: req.user.organizationId }).sort({ createdAt: -1 });
  res.json(flags);
});

// POST /api/admin/flags
router.post("/flags", authenticate, requireRole("org_admin"), async (req, res) => {
  const { featureKey, enabled = false } = req.body;
  if (!featureKey?.trim())
    return res.status(400).json({ error: "featureKey is required" });

  const normalised = featureKey.trim().toLowerCase().replace(/\s+/g, "_");

  try {
    const flag = await FeatureFlag.create({
      featureKey: normalised,
      enabled: Boolean(enabled),
      organization: req.user.organizationId,
      createdBy: req.user.id,
    });
    res.status(201).json(flag);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: `Flag "${normalised}" already exists for your organization` });
    throw err;
  }
});

// PATCH /api/admin/flags/:id
router.patch("/flags/:id", authenticate, requireRole("org_admin"), async (req, res) => {
  const flag = await FeatureFlag.findById(req.params.id);
  if (!flag) return res.status(404).json({ error: "Flag not found" });
  if (flag.organization.toString() !== req.user.organizationId)
    return res.status(403).json({ error: "Forbidden" });

  const { enabled, featureKey } = req.body;
  if (typeof enabled === "boolean") flag.enabled = enabled;
  if (featureKey) flag.featureKey = featureKey.trim().toLowerCase();
  await flag.save();
  res.json(flag);
});

// DELETE /api/admin/flags/:id
router.delete("/flags/:id", authenticate, requireRole("org_admin"), async (req, res) => {
  const flag = await FeatureFlag.findById(req.params.id);
  if (!flag) return res.status(404).json({ error: "Flag not found" });
  if (flag.organization.toString() !== req.user.organizationId)
    return res.status(403).json({ error: "Forbidden" });

  await flag.deleteOne();
  res.status(204).send();
});

module.exports = router;
