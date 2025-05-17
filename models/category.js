const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: "admin",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
