const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema(
  {
    reportedByPro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proProfile",
    },
    reportedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
    reportedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userProfile",
    },
    reportedPro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proProfile",
    },
    reason: {
      type: String,
      enum: [
        "I'm Not Interested",
        "Fake Profile",
        "Spam",
        "Inappropriate Prompts",
      ],
    },
  },
  { timestamps: true }
);
const reportModel = mongoose.model("report", reportSchema);
module.exports = reportModel;
