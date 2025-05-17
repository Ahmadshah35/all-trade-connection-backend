const otpModel = require("../models/otp");

const generateOtp = async (email) => {
  
  const Otp = Math.floor(100000 + Math.random() * 900000).toString();

  const genOtp = new otpModel({
    email,
    otp: Otp,
  });
  const result = await genOtp.save();
  return result;
};

const verifyOtp = async (req) => {
  const { Otp, email } = req.body;
  const verify = await otpModel
    .findOne({ email: email, otp: Otp })
  return verify;
};

const resendOtp = async (req) => {
  const { email } = req.body;
  const resend = await otpModel.findOne({ email: email });

  return resend;
};

const deleteOtp = async (req) => {
  const { email } = req.body;
  const user = await otpModel.deleteMany({email:email});
  return user;
}; 
module.exports = {
  generateOtp,
  verifyOtp,
  resendOtp,
  deleteOtp
};
