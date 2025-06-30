const mongoose = require("mongoose")

const reviewSchema =new  mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userProfile",
    required:true
  },
  proProfileId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"proProfile",
   required:true 
  },
  comment:{
    type:String
  },
  rating:{
    type:Number,
    enum:[0,1,2,3,4,5]
  }
},{timestamps:true})

const reviewModel =  mongoose.model("review", reviewSchema)


module.exports= reviewModel