const profileModel = require("../models/userProfile");

const updateProfile = async (req ,id, userData) => {
  // console.log("data",req.files.image[0].filename)
  // return
const image = req.files.image[0].filename
  const profile = await profileModel.findByIdAndUpdate(id,
    { $set:{ ...userData , image : image}}, 
    { new: true }
  );
  // console.log(profile)
  return profile;
};

const profileCreated = async (userProfileId) => {
  const profile = await profileModel.findByIdAndUpdate(userProfileId,
    { $set:{profileCreated: true}},
    { new: true }
  );
  // console.log(profile)
  return profile;
};

const getProfile = async (id) => {
  const profile = await profileModel.findOne({_id: id, isDeleted:false});
  return profile;
};

const getAllProfile = async (userId) => {
  const profile = await profileModel.find(userId);
  return profile;
};



module.exports = {
  updateProfile,
  getProfile,
  getAllProfile,
  profileCreated
};
