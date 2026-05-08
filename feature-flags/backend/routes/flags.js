const router = require("express").Router();
const Organization = require("../models/Organization");
const FeatureFlag = require("../models/FeatureFlag");

// GET /api/flags/check?organizationId=...&featureKey=...
router.get("/check", async (req, res) => {
  const { organizationId, featureKey } = req.query;
  if (!organizationId || !featureKey)
    return res.status(400).json({ error: "organizationId and featureKey are required" });

  const org = await Organization.findById(organizationId);
  if (!org) return res.status(404).json({ error: "Organization not found" });

  const flag = await FeatureFlag.findOne({
    featureKey: featureKey.trim().toLowerCase(),
    organization: organizationId,
  });

  res.json({
    organizationId,
    organizationName: org.name,
    featureKey: featureKey.trim().toLowerCase(),
    enabled: flag ? flag.enabled : false,
    exists: Boolean(flag),
  });
});

// GET /api/flags/organizations  — for the user UI dropdown
router.get("/organizations", async (req, res) => {
  const orgs = await Organization.find().select("_id name").sort({ name: 1 });
  res.json(orgs.map((o) => ({ id: o._id, name: o.name })));
});

module.exports = router;
