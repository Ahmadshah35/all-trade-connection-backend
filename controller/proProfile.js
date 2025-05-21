const { default: mongoose } = require("mongoose");
const func = require("../functions/proProfile");
const proProfileModel = require("../models/proProfile");


const getAllProProfile = async (req, res) => {
  try {
    const profile = await func.getAllProProfile(req);

    if (profile.length == 0) {
      return res
        .status(200)
        .json({ status: "failed", message: "invalid Id", sucess: false });
    } else {
      return res
        .status(200)
        .json({ status: "successful", data: profile, sucess: true });
    }
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

const getProCategory = async (req, res) => {
  try {
    const profile = await func.getProCategory(req);

    if (profile.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: " category not found",
        sucess: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "successful", data: profile, sucess: true });
    }
  } catch (error) {
    console.error("Error  project:", error);
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong",
      sucess: false,
      error: error.message,
    });
  }
};

const getProProfileByLocationAndCategory = async (req, res) => {
  try {
    const { category, latitude, longitude } = req.query;
    if (category && latitude && longitude) {
      const proProfile = await func.getProProfileByLocationAndCategory(req);
      if (proProfile) {
        return res
          .status(200)
          .json({ message: "projects", data: proProfile, sucess: true });
      }
    } else if (category) {
      const categorys = await func.getProCategory(req);

      if (categorys) {
        return res
          .status(200)
          .json({ status: "successful", data: categorys, sucess: true });
      } 
    } else if (latitude && longitude) {
      const proProfile = await func.getProProfiletByLocation(req);
      if (proProfile) {
        return res
          .status(200)
          .json({ message: "proProfile", data: proProfile, sucess: true });
      }
    } else {
      return res.status(200).json({
        status: "failed",
        message: "proProfile not found",
        sucess: false,
      });
    }
  } catch (error) {
    console.error("Error fetching proProfile:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateIncludingTheseDays = async (req, res) => {
  const { id, newDay } = req.body;

  const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (
    !Array.isArray(newDay) ||
    newDay.some((day) => !validDays.includes(day))
  ) {
    return res.status(200).json({
      sucess: false,
      message: "Invalid day format. Must be an array of valid day names.",
    });
  }
  try {
    const updatedDoc = await func.updateIncludingTheseDays(id, newDay);

    if (!updatedDoc) {
      return res
        .status(404)
        .json({ sucess: false, message: "Document not found" });
    } else {
      const userWithoutPassword = await proProfileModel
        .findById(id)
        .select("-password")
        .lean();
      res.status(200).json({
        sucess: true,
        message: "Day added ",
        data: userWithoutPassword,
      });
    }
  } catch (error) {
    console.error("Error updating days:", error.message);
    res.status(500).json({
      sucess: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getProCategory,
  getAllProProfile,
  getProProfileByLocationAndCategory,
  updateIncludingTheseDays,
};
