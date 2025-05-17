const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName:{
      type:String,
      required: true,
    },
    lastName:{
      type:String
    },
    image: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
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
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    type:{
      type:String,
      default:"User"
    },
    profileCreated:{
      type:Boolean,
      default:"false"
    }
  },
  { timestamps: true }
);

// userProfileSchema.virtual("locations", {
//   ref: "location",               // Model to populate
//   localField: "_id",             // Field in UserProfile
//   foreignField: "userProfileId"  // Field in Location
// });

// userProfileSchema.set("toObject", { virtuals: true });
// userProfileSchema.set("toJSON", { virtuals: true });

userProfileSchema.index({ currentLocation: "2dsphere" });

const userProfileModel = mongoose.model("userProfile", userProfileSchema);

module.exports = userProfileModel;
