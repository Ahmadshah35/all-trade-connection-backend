const userProfile = require("../models/userProfile");
const proProfile = require("../models/proProfile");
const bcrypt = require("bcrypt");
const projectModel = require("../models/project");
const otpModel = require("../models/otp");
const proProfileModel = require("../models/proProfile");

const signUpUser = async (decode) => {
  decode.currentLocation = {
    type: "Point",
    coordinates: [
      parseFloat(decode.longitude),
      parseFloat(decode.latitude),
    ],
    locationName: decode.locationName,
  };
  const hashPassword = await bcrypt.hash(decode.password, 10);
  const user = new userProfile({
    email: decode.email,
    password: hashPassword,
    firstName: decode.firstName,
    lastName: decode.lastName || null,
    image: decode.image,
    phoneNumber:decode.phoneNumber,
    address:decode.address,
    longitude:decode.longitude,
    latitude:decode.latitude,
    locationName:decode.locationName,
    currentLocation:decode.currentLocation,
    state:decode.state,
    city:decode.city,
    zipCode:decode.zipCode

  });
  const result = await user.save();
  return result;
};

const validiateEmailUser = async (req) => {
  const { email } = req.body;
  const user = await userProfile.findOne({ email: email });
  return user;
};
const validiatelUserById = async (id) => {
  // const { id } = req.body;
  const user = await userProfile.findById({_id:id });
  return user;
};




const getUser = async (req) => {
  const { email } = req.body;
  const user = await userProfile.findOne({ email: email });
  return user;
};

const comparePassword = async (password, hashPassword) => {
  const compare = await bcrypt.compare(password, hashPassword);
  return compare;
};

const isVerifiedUser = async (email) => {
  const verify = await userProfile.findOneAndUpdate(
    { email: email },
    {
      $set: { isVerified: true },
    },
    { new: true }
  );
  return verify;
};

const resetPasswordUser = async (email, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await userProfile.findOneAndUpdate(
    { email: email },
    {
      $set: { password: hashPassword },
    },
    { new: true }
  );
  return resetPassword;
};
const resetUserPasswordById = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await userProfile.findByIdAndUpdate(
    { _id: id },
    {
      $set: { password: hashPassword },
    },
    { new: true }
  );
  return resetPassword;
};



const verifyUser = async (userId) => {
  const verify = await userProfile.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true }
  );
  return verify;
};

const deleteUser = async (req) => {
  const { id } = req.body;
  const user = await userProfile.findByIdAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );
  const project = await projectModel.findOneAndUpdate(
    { userId: id },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return user;
};

const SignUpPro = async (decode) => {
  decode.currentLocation = {
    type: "Point",
    coordinates: [
      parseFloat(decode.longitude),
      parseFloat(decode.latitude),
    ],
    locationName: decode.locationName,
  };
  const hashPassword = await bcrypt.hash(decode.password, 10);
  const pro = new proProfileModel({
    email: decode.email,
    password: hashPassword,
    firstName: decode.firstName,
    lastName: decode.lastName || null,
    phoneNumber:decode.phoneNumber,
    bio:decode.bio,
    image: decode.image,
    category:decode.category,
    address:decode.address,
    includingTheseDays:decode.includingTheseDays,
    startTime:decode.startTime,
    endTime:decode.endTime,
    certificate:decode.certificate,
    longitude:decode.longitude,
    latitude:decode.latitude,
    locationName:decode.locationName,
    currentLocation:decode.currentLocation,
    state: decode.state,
    city: decode.city,
    zipCode: decode.zipCode,
    

  });
  const result = await pro.save();
  return result;
};
const validiateEmailPro = async (req) => {
  const { email } = req.body;
  const pro = await proProfile.findOne({ email: email });
  return pro;
};
const validiatelProById = async (id) => {
  // const { id } = req.body;
  const pro = await userProfile.findById({_id:id });
  return pro;
};


const getPro = async (req) => {
  const { email } = req.body;
  const pro = await proProfile.findOne({ email: email });
  return pro;
};

const isVerifiedPro = async (email) => {
  const verify = await proProfile.findOneAndUpdate(
    { email: email },
    {
      $set: { isVerified: true },
    },
    { new: true }
  );
  return verify;
};

const resetPasswordPro = async (email, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await proProfile.findOneAndUpdate(
    { email: email },
    {
      $set: { password: hashPassword },
    },
    { new: true }
  );
  return resetPassword;
};

const resetProPasswordById = async (id, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const resetPassword = await proProfile.findOneAndUpdate(
    { _id: id },
    {
      $set: { password: hashPassword },
    },
    { new: true }
  );
  return resetPassword;
};


const verifyPro = async (userId) => {
  const verify = await proProfile.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true }
  );
  return verify;
};

const deletePro = async (req) => {
  const { id } = req.body;
  const pro = await proProfile.findByIdAndUpdate(
    { _id: id },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return pro;
};
;

module.exports = {
  signUpUser,
  SignUpPro,
  validiateEmailUser,
  validiateEmailPro,
  getUser,
  getPro,
  comparePassword,
  isVerifiedUser,
  isVerifiedPro,
  resetPasswordUser,
  resetPasswordPro,
  verifyUser,
  verifyPro,
  deleteUser,
  deletePro,
  validiatelUserById,
  validiatelProById,
  resetUserPasswordById,
  resetProPasswordById
};
