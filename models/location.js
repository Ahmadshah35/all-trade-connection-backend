const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userProfileId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"userProfile"
  },
  proProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "proProfile",
  },
  locationName: {
    type: String,
  
  },
  address: {
    type: String,
    
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
  longitude:{
  type:Number,
  required:true
  },
  latitude:{
    type:Number,
    required:true
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
  isSelected:{
    type:Boolean,
    default:false
  }
},
{
  timestamps: true,
});

locationSchema.index({ location: "2dsphere" });

const locationModel = mongoose.model("location", locationSchema);
module.exports = locationModel;
