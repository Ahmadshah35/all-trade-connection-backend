const { default: mongoose } = require("mongoose");
const userFunc = require("../functions/profile");
const proFunc = require("../functions/proProfile");

const func = require("../functions/location");
const locationModel = require("../models/location");
const createLocation = async (req, res) => {
  try {
    const location = await func.createLocation(req);
    if (location) {
      const userProfileId = location.userProfileId;
      const proProfileId = location.proProfileId;

      if (userProfileId) {
        const created = await userFunc.profileCreated(userProfileId);
        return res
          .status(200)
          .json({ status: "sucess", data: {location, profileCreated: created.profileCreated}, sucess: true });
      } else if (proProfileId) {
        const created = await proFunc.proProfileCreated(proProfileId);
        return res
          .status(200)
          .json({ status: "sucess", data:{ location , profileCreated: created.profileCreated}, sucess: true });
      } else {
        return res
          .status(200)
          .json({ message: "profile id required", sucess: false });
      }
    } else {
      return res.status(200).json({
        status: "failed",
        message: "data isn't saved in Database",
        sucess: false,
      });
    }
  } catch (error) {
    console.error("createLocation failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      sucess: false,
    });
  }
};

const upadateLocation = async (req, res) => {
  try {
    const { id } = req.body;
    const userData = req.body;
    const location = await func.updateLocation(id, userData);
    // console.log(profile)
    if (location) {
      res.status(200).json({ status: "sucess", data: location, sucess: true });
      return;
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "update failed", sucess: false });
    }
  } catch (error) {
    console.error("error :", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      sucess: false,
    });
  }
};

const deleteLocation = async (req, res) => {
  try {
    let { id } = req.body;
    const location = await func.deleteLocation(id);
    if (location) {
      return res.status(200).json({
        message: "Deleted successfully",
        data: location,
        sucess: true,
      });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "Delete failed", sucess: false });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      sucess: false,
    });
  }
};

const getLocation = async (req, res) => {
  try {
    const { id } = req.query;
    const location = await func.getLocation({ _id: id });
    if (location.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: "location not found",
        sucess: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: location, sucess: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};

const getAllLocation = async (req, res) => {
  try {
    const { userId } = req.query;
    const location = await func.getAllLocation({ userId: userId });
    if (location.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: "location not found",
        sucess: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: location, sucess: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};

const getLocationByProProfileId = async (req, res) => {
  try {
    const { proProfileId } = req.query;
    const location = await func.getLocationByProProfileId(proProfileId);
    if (location.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: "location not found",
        sucess: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: location, sucess: true });
    }
  } catch (error) {
    console.error("Error in get location:", error.message);
    return res.status(500).json({
      sucess: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateSelectedProfessionalLocation = async (req, res) => {
  try {
    const locations = await func.updateSelectedProfessionalLocation(req);
    if (!locations) {
      return res.status(404).json({
        sucess: false,
        message: "Location not found ",
      });
    }
    const updateProfile = await func.addProfessionalLocation(locations);
    return res.status(200).json({
      sucess: true,
      message: " location updated successfully",
      data: locations,
      profileData: updateProfile,
    });
  } catch (error) {
    console.error("Error updating selected location:", error.message);
    return res.status(500).json({
      sucess: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const updateSelectedUserLocation = async (req, res) => {
  try {
    const locations = await func.updateSelectedUserLocation(req);
    if (!locations) {
      return res.status(404).json({
        sucess: false,
        message: "Location not found ",
      });
    }
    const updateProfile = await func.addUserLocation(locations);
    return res.status(200).json({
      sucess: true,
      message: " location updated successfully",
      data: locations,
      profileData: updateProfile,
    });
  } catch (error) {
    console.error("Error updating selected location:", error.message);
    return res.status(500).json({
      sucess: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createLocation,
  upadateLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
  updateSelectedProfessionalLocation,
  getLocationByProProfileId,
  updateSelectedUserLocation
};
