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
    image:{
    type: String,
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
        enum: ["Point"]
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
    },
    city: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    workingDays: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
      },
    ],

    certificate: {
      type: [String],
    },
    avgRating: {
      type: Number ,
      default: 0
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
