const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expiresIn: "600"
    }
  },
  {
    timestamps: true,
  }
);


const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
