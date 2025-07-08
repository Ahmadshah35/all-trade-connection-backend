const { default: mongoose } = require("mongoose");
const func = require("../functions/profile");
const proFunc = require("../functions/proProfile");
const userProfileModel = require("../models/userProfile");
const proProfileModel = require("../models/proProfile");
const reviewFunc = require("../functions/review")
const project= require("../functions/project")

const upadateProfile = async (req, res) => {
  try {
    // const workingDays = JSON.parse(req.body.category)
    // console.log("data :", req.body);
    // return
    const { id, type } = req.body;
    const userData = req.body;
    if (type == "User") {
      // console.log("profile", req.files)
      const profile = await func.updateProfile(req, id, userData);
      // console.log(profile)
      if (profile) {
        const created = await func.profileCreated(id)
        const userWithoutPassword = await userProfileModel
          .findById(id)
          .select("-password")
          .lean();
        res
          .status(200)
          .json({ status: "sucess", data: userWithoutPassword, success: true });
      } else {
        return res.status(200).json({
          status: "failed",
          message: "profile update failed",
          success: false,
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
          success: false,
        });  
      }

      const existingProfile = await proFunc.getProProfile(id);
      if (!existingProfile) {
        return res.status(200).json({
          status: "failed",
          message: "Profile not found",
          success: false,
        });
      }

      const profile = await proFunc.updateProProfile(
        id,
        userData,
        req.files
      );

      if (profile) {
        const created = await proFunc.proProfileCreated(id);
        const userWithoutPassword = await proProfileModel
          .findById(id)
          .select("-password")
          .lean();
        return res
          .status(200)
          .json({ status: "success", data: userWithoutPassword, success: true });
      }else {
        return res
          .status(200)
          .json({ status: "failed", message: "Update failed", success: false });
      }
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "invalid type", success: false });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { _id,type } = req.user;
    if (type == "User") {
      const profile = await func.getProfile(_id);
      // console.log("first",profile)
      if (!profile) {
        return res
          .status(200)
          .json({ status: "profile not found", success: false });
      } else {
        const userId= profile._id
        const projects = await project.getProjectByUserProfileId(userId)
        const projectLength = projects.length
        const userWithoutPassword = await userProfileModel
          .findById(_id)
          .select("-password")
          .lean();
        return res
          .status(200)
          .json({
            status: "sucessful",
            data:{ ...userWithoutPassword,projectLength},
            success: true,
          });
      }
    } else if (type == "Professional") {
      const profile = await proFunc.getProProfile(_id);
      if (!profile || profile.length === 0) {
        return res.status(200).json({
          status: "failed",
          message: "No profiles found",
          success: false,
        });
      } else {
        const proProfileId = profile._id
        const reviews = await reviewFunc.getAllReviewOnProProfile(proProfileId)
        console.log("reviews",reviews)
        const reviewLength= reviews.length
        const status = "Done"
        const getProject = await project.getProjectByStatusAndProProfileId(proProfileId,status)
        const completedProject = getProject.length
        const userWithoutPassword = await proProfileModel
          .findById(_id)
          .select("-password").populate("category")
          .lean();
        return res.status(200).json({
          status: "successful",
          data:{ ...userWithoutPassword,reviews,reviewLength,completedProject},
          success: true,
        });
      }
    } else {
      return res.status(200).json({ status: "invalid type", success: false });
    }
  } catch (error) {
    console.error(" error :", error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
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
        .json({ status: "profile not found", success: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: profile, success: true });
    }
  } catch (error) {
    console.error(" error :", error);
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  upadateProfile,
  getProfile,
  getAllProfile,
};
