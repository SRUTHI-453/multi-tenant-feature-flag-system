require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/feature_flags",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret-jwt-key-change-in-prod",
  JWT_EXPIRES_IN: "8h",
  SUPER_ADMIN: {
    email: process.env.SUPER_ADMIN_EMAIL || "superadmin@flagsys.io",
    password: process.env.SUPER_ADMIN_PASSWORD || "Admin@1234",
    role: "super_admin",
    id: "super-admin-static-id",
  },
};
