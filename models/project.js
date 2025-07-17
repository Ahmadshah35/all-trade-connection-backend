const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userProfile",
      required: true,
    },
    asignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proProfile",
    },
    images: {
      type: [String],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    inDiscussionPro:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"proProfile"
      }
      ],
    selectDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "price must be a positive number"],
    },
    locationName: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
      locationName: {
        type: String,
      },
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    appartmentNo: {
      type: String,
    },
    additionalNote: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Hired", "In Discussion", "Done", "Canceled", "Open"],
      default: "Open",
    },
    ProfessionalType: {
      type: String,
      enum: ["New Professional", "Previous Professional"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

projectSchema.index({ location: "2dsphere" });

const projectModel = mongoose.model("project", projectSchema);
module.exports = projectModel;
