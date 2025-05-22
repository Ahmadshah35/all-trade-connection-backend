const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    bio: {
      type: String,
    },
    currentLocation: {
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
    },
    category: [{
      type:mongoose.Schema.ObjectId,
      ref:"category"
    }],
    address: {
      type: String,
    },
    state:{
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    includingTheseDays: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    certificate: {
      type: [String],
    },
    avgRating: {
      type: Number ,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "Professional",
    },
    profileCreated:{
      type:Boolean,
      default:"false"
    }
  },
  { timestamps: true }
);

// profileSchema.virtual("locations", {
//   ref: "location",               // Model to populate
//   localField: "_id",             // Field in UserProfile
//   foreignField: "proProfileId"  // Field in Location
// });

// profileSchema.set("toObject", { virtuals: true });
// profileSchema.set("toJSON", { virtuals: true });
profileSchema.index({ currentLocation: "2dsphere" });

const proProfileModel = mongoose.model("proProfile", profileSchema);

module.exports = proProfileModel;
