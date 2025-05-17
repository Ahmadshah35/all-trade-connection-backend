const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    proProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proProfile",
      required: true,
    },
    price: {
      type: Number,
    },
    proposal: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Accept", "Reject", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const proposalModel = mongoose.model("proposal", proposalSchema);
module.exports = proposalModel;
