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
        const update = await func.updateSelectedUserLocation(
          location._id,
          userProfileId
        );
        const created = await userFunc.profileCreated(userProfileId);
        const locations = req.body;
        const selected = await func.addUserLocation(locations);
        return res.status(200).json({ data: [location], success: true });
      } else if (proProfileId) {
        // console.log("first",req.body)
        const update = await func.updateSelectedProfessionalLocation(
          location._id,
          proProfileId
        );
        const created = await proFunc.proProfileCreated(proProfileId);
        // console.log("first",created)
        // return
        const locations = req.body;
        // console.log("first",locations)

        const selected = await func.addProfessionalLocation(locations);
        return res.status(200).json({ data: [location], success: true });
      } else {
        return res
          .status(200)
          .json({ message: "Missing profile Id", success: false });
      }
    } else {
      return res.status(200).json({
        message: "data isn't saved in Database",
        success: false,
      });
    }
  } catch (error) {
    console.error(" failed:", error);
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
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
      res.status(200).json({ status: "sucess", data: location, success: true });
      return;
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "update failed", success: false });
    }
  } catch (error) {
    console.error("error :", error);
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
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
        success: true,
      });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "Delete failed", success: false });
    }
  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

const getLocation = async (req, res) => {
  try {
    const { id } = req.query;
    const location = await func.getLocation({ _id: id });
    if (!location) {
      return res.status(200).json({
        status: "failed",
        message: "location not found",
        success: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: location, success: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const getLocationByProfileId = async (req, res) => {
  try {
    const {userProfileId, proProfileId } = req.query;

    if (proProfileId){
    const location = await func.getLocationByProProfileId(proProfileId);
    if (location.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: "location not found",
        success: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: location, success: true });
    }
  }
  if(userProfileId){
    const location = await func.getLocationByUserProfileId(userProfileId);
    if (location.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: "location not found",
        success: false,
      });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: location, success: true });
    }
  }
  } catch (error) {
    console.error("Error in get location:", error.message);
    return res.status(400).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateSelectedLocation = async (req, res) => {
  try {
    const { type, locationId, proProfileId, userProfileId } = req.body;
    if (type == "User") {
      const locations = await func.updateSelectedUserLocation(
        locationId,
        userProfileId
      );
      if (!locations) {
        return res.status(200).json({
          success: false,
          message: "Location not found ",
        });
      }
      const updateProfile = await func.addUserLocation(locations);
      return res.status(200).json({
        success: true,
        message: " location updated successfully",
        data: locations,
        profileData: updateProfile,
      });
    } else if (type == "Professional") {
      const locations = await func.updateSelectedProfessionalLocation(
        locationId,
        proProfileId
      );
      if (!locations) {
        return res.status(200).json({
          success: false,
          message: "Location not found ",
        });
      }
      const updateProfile = await func.addProfessionalLocation(locations);
      return res.status(200).json({
        success: true,
        message: " location updated successfully",
        data: locations,
        profileData: updateProfile,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "invalid type",
      });
    }
  } catch (error) {
    console.error("Error updating selected location:", error.message);
    return res.status(400).json({
      success: false,
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
  getLocationByProfileId,
  updateSelectedLocation,
};
