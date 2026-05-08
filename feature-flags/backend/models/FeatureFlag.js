const mongoose = require("mongoose");

const featureFlagSchema = new mongoose.Schema(
  {
    featureKey: {
      type: String,
      required: [true, "featureKey is required"],
      trim: true,
      lowercase: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Enforce unique featureKey per organization
featureFlagSchema.index({ featureKey: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model("FeatureFlag", featureFlagSchema);
