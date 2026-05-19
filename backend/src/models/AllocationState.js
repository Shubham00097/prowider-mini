const mongoose = require("mongoose");

const allocationStateSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      unique: true,
    },

    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AllocationState",
  allocationStateSchema
);