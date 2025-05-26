const  mongoose = require("mongoose")

const supportSchema = new mongoose.Schema({
  fullName:{
    type:String
  },
  email:{
    type :String
  },
  phoneNumber:{
    type:Number
  },
  message:{
    type:String
  }
},{timestamps:true})


const supportModel= mongoose.model("support", supportSchema)

module.exports = supportModel
