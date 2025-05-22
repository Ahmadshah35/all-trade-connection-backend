const categoryModel = require("../models/category");

const createCategory = async (req, res) => {
  try {
    const { adminId, name } = req.body;

    const existingCategory = await categoryModel.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory) {
      return res
        .status(200)
        .json({ message: "Category already exists", success: false });
    }

    const category = new categoryModel({ adminId, name });
    const result = await category.save();

    return res
      .status(200)
      .json({ message: "Successfully created", success: true, data: result });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(400)
      .json({ message: "Something went wrong", success: false });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const all = await categoryModel.find();
    res.status(200).json({ message: "all category", success: true, data: all });
  } catch (error) {
    console.log("error", error);
    res
      .status(400)
      .json({
        message: "something went wrong",
        success: false,
        error: error.message,
      });
  }
};

const deleteCategory = async(req,res)=>{
try {
  const {id}= req.body
  const category = await categoryModel.findByIdAndDelete({_id:id})
  if(category){
    res.status(200).json({success:true, message:"sucessfully deleted"}) 
  }else{
    res.status(200).json({success:false, message:"category not found"})
  }
} catch (error) {
  console.log("error", error)
  res.status(400).json({success:false, message:"something went wrong"})
}
}
module.exports = {
  createCategory,
  getAllCategory,
  deleteCategory
};
