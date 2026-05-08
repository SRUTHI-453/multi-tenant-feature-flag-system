const mongoose = require("mongoose");

/**
 * User model — covers org admins only.
 * Super admin uses static credentials (per spec), so no DB record needed.
 *
 * role field is stored explicitly to support future role expansion
 * (e.g. viewer, billing_admin, etc.) without schema changes.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["org_admin"],
      default: "org_admin",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

// Never return passwordHash in API responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
