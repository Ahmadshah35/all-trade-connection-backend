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
        .json({ message: "Category already exists", sucess: false });
    }

    const category = new categoryModel({ adminId, name });
    const result = await category.save();

    return res
      .status(200)
      .json({ message: "Successfully created", sucess: true, data: result });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(400)
      .json({ message: "Something went wrong", sucess: false });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const all = await categoryModel.find();
    res.status(200).json({ message: "all category", sucess: true, data: all });
  } catch (error) {
    console.log("error", error);
    res
      .status(400)
      .json({
        message: "something went wrong",
        sucess: false,
        error: error.message,
      });
  }
};

const deleteCategory = async(req,res)=>{
try {
  const {id}= req.body
  const category = await categoryModel.findByIdAndDelete({_id:id})
  if(category){
    res.status(200).json({sucess:true, message:"sucessfully deleted"}) 
  }else{
    res.status(200).json({sucess:false, message:"category not found"})
  }
} catch (error) {
  console.log("error", error)
  res.status(400).json({sucess:false, message:"something went wrong"})
}
}
module.exports = {
  createCategory,
  getAllCategory,
  deleteCategory
};
