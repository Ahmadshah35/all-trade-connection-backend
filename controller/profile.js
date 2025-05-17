const { default: mongoose } = require("mongoose");
const func = require("../functions/profile");
const proFunc = require("../functions/proProfile");
const userProfileModel = require("../models/userProfile");
const proProfileModel = require("../models/proProfile");

const upadateProfile = async (req, res) => {
  try {
    const { id, type } = req.body;
    const userData = req.body;
    if (type == "User") {
      // console.log("profile", req.files)
      const profile = await func.updateProfile(req, id, userData);
      // console.log(profile)
      if (profile) {
        // const created = await func.profileCreated(id)
        const userWithoutPassword = await userProfileModel
          .findById(id)
          .select("-password")
          .lean();
        res
          .status(200)
          .json({ status: "sucess", data: userWithoutPassword, sucess: true });
      } else {
        return res.status(200).json({
          status: "failed",
          message: "profile update failed",
          sucess: false,
          error: error.message,
        });
      }
    } else if (type == "Professional") {
      // const { id } = req.body;
      // const userData = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).json({
          status: "failed",
          message: "Invalid profile ID",
          sucess: false,
        });
      }

      const existingProfile = await proFunc.getProProfile(id);
      if (!existingProfile) {
        return res.status(200).json({
          status: "failed",
          message: "Profile not found",
          sucess: false,
        });
      }

      const profile = await proFunc.updateProProfile(
        req,
        id,
        userData,
        req.files
      );

      if (profile) {
        // const created = await func.proProfileCreated(id);
        const userWithoutPassword = await proProfileModel
          .findById(id)
          .select("-password")
          .lean();
        return res
          .status(200)
          .json({ status: "success", data: userWithoutPassword, sucess: true });
      } else {
        return res
          .status(200)
          .json({ status: "failed", message: "Update failed", sucess: false });
      }
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "invalid type", sucess: false });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id,type } = req.query;
    if (type == "User") {
      const profile = await func.getProfile(id);
      // console.log("first",profile)
      if (!profile) {
        return res
          .status(200)
          .json({ status: "profile not found", sucess: false });
      } else {
        const userWithoutPassword = await userProfileModel
          .findById(id)
          .select("-password")
          .lean();
        return res
          .status(200)
          .json({
            status: "sucessful",
            data: userWithoutPassword,
            sucess: true,
          });
      }
    } else if (type == "Professional") {
      const profile = await proFunc.getProProfile(id);
      if (!profile || profile.length === 0) {
        return res.status(200).json({
          status: "failed",
          message: "No profiles found",
          sucess: false,
        });
      } else {
        const userWithoutPassword = await proProfileModel
          .findById(id)
          .select("-password")
          .lean();
        return res.status(200).json({
          status: "successful",
          data: userWithoutPassword,
          sucess: true,
        });
      }
    } else {
      return res.status(200).json({ status: "invalid type", sucess: false });
    }
  } catch (error) {
    console.error(" error :", error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

const getAllProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    const profile = await func.getAllProfile({ userId: userId });
    if (profile.length == 0) {
      return res
        .status(200)
        .json({ status: "profile not found", sucess: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: profile, sucess: true });
    }
  } catch (error) {
    console.error(" error :", error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

module.exports = {
  upadateProfile,
  getProfile,
  getAllProfile,
};
