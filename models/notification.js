const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userProfile",
    },
    proId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proProfile",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proposal",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    type: {
      type: String,
      enum:["Project" , "Proposal"]
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel;
