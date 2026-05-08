/**
 * Lightweight JSON file-based persistence layer.
 * Trade-off: simple, zero-dependency, sufficient for this scope.
 * In production: replace with PostgreSQL / MongoDB.
 */

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "data.json");

// ── Schema ────────────────────────────────────────────────────────────────────
const DEFAULT_DB = {
  organizations: [],
  users: [],        // org admins + super admin marker
  feature_flags: [],
};

// ── I/O ───────────────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ── Organizations ──────────────────────────────────────────────────────────────
const orgs = {
  create(name) {
    const db = readDB();
    const org = { id: uuidv4(), name, createdAt: new Date().toISOString() };
    db.organizations.push(org);
    writeDB(db);
    return org;
  },
  findAll() {
    return readDB().organizations;
  },
  findById(id) {
    return readDB().organizations.find((o) => o.id === id) || null;
  },
  findByName(name) {
    return readDB().organizations.find(
      (o) => o.name.toLowerCase() === name.toLowerCase()
    ) || null;
  },
};

// ── Users ──────────────────────────────────────────────────────────────────────
const users = {
  create({ email, passwordHash, role, organizationId = null }) {
    const db = readDB();
    const user = {
      id: uuidv4(),
      email,
      passwordHash,
      role,             // "org_admin"
      organizationId,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDB(db);
    return user;
  },
  findByEmail(email) {
    return (
      readDB().users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || null
    );
  },
  findById(id) {
    return readDB().users.find((u) => u.id === id) || null;
  },
  findByOrg(organizationId) {
    return readDB().users.filter((u) => u.organizationId === organizationId);
  },
};

// ── Feature Flags ──────────────────────────────────────────────────────────────
const flags = {
  create({ featureKey, enabled = false, organizationId, createdBy }) {
    const db = readDB();
    const flag = {
      id: uuidv4(),
      featureKey,
      enabled,
      organizationId,
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.feature_flags.push(flag);
    writeDB(db);
    return flag;
  },
  findByOrg(organizationId) {
    return readDB().feature_flags.filter(
      (f) => f.organizationId === organizationId
    );
  },
  findById(id) {
    return readDB().feature_flags.find((f) => f.id === id) || null;
  },
  findByKeyAndOrg(featureKey, organizationId) {
    return (
      readDB().feature_flags.find(
        (f) =>
          f.featureKey.toLowerCase() === featureKey.toLowerCase() &&
          f.organizationId === organizationId
      ) || null
    );
  },
  update(id, updates) {
    const db = readDB();
    const idx = db.feature_flags.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    db.feature_flags[idx] = {
      ...db.feature_flags[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    return db.feature_flags[idx];
  },
  delete(id) {
    const db = readDB();
    const idx = db.feature_flags.findIndex((f) => f.id === id);
    if (idx === -1) return false;
    db.feature_flags.splice(idx, 1);
    writeDB(db);
    return true;
  },
};

module.exports = { orgs, users, flags };
