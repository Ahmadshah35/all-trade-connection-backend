const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");

const signUpAdmin = async (req) => {
  const {email, password } = req.body;
  const admin = new adminModel(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  admin.password = hashPassword;
  const result = await admin.save();
  return result;
};

const validiateAdminEmail = async (req) => {
  const { email } = req.body;
  return await adminModel.findOne({ email });
};

const getAdmin = async (id) => {
  return await adminModel.findById(id);
};

const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

const isVerifiedAdmin = async (email) => {
  return await adminModel.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );
};


const resetAdminPassword = async (email, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  return await adminModel.findOneAndUpdate(
    { email },
    { $set: { password: hashPassword } },
    { new: true }
  );
};

const verifyAdmin = async (userId) => {
  return await adminModel.findOneAndUpdate(
    { _id: userId },
    { $set: { isVerified: true } },
    { new: true }
  );
};


const updateAdminEmail = async (id, email) => {
  return await adminModel.findByIdAndUpdate(
    id,
    { $set: { email } },
    { new: true }
  );
};

module.exports = {
  signUpAdmin,
  validiateAdminEmail,
  verifyAdmin,
  comparePassword,
  resetAdminPassword,
  isVerifiedAdmin,
  getAdmin,
  updateAdminEmail,
};
