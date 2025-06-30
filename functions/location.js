const locationModel = require("../models/location");
const mongoose = require("mongoose");
const proProfileModel = require("../models/proProfile");
const userProfileModel = require("../models/userProfile");
const { decode } = require("jsonwebtoken");
const ObjectId = mongoose.Types.ObjectId;

const createLocation = async (req) => {
  req.body.location = {
    type: "Point",
    coordinates: [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ],
    locationName: req.body.locationName,
  };
  const location = new locationModel(req.body);

  const result = await location.save();
  return result;
};

const createLocationByOtp = async (decode,userProfileId = null ,proProfileId = null) => {
  decode.location = {
    type: "Point",
    coordinates: [
      parseFloat(decode.longitude),
      parseFloat(decode.latitude),
    ],
    locationName: decode.locationName,
  };
  const location = new locationModel({
    userProfileId:userProfileId,
    proProfileId:proProfileId,
    address:decode.address,
    longitude:decode.longitude,
    latitude:decode.latitude,
    locationName:decode.locationName,
    location:decode.currentLocation,
    state:decode.state,
    city:decode.city,
    zipCode:decode.zipCode});

  const result = await location.save();
  return result;
};

const updateLocation = async (id, userData) => {
  const location = await locationModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  );
  return location;
};

const deleteLocation = async (id) => {
  try {
    const deletedLocation = await locationModel.findByIdAndDelete({ _id: id });

    return deletedLocation;
  } catch (error) {
    console.error("Error in deleteLocation:", error);
    throw error;
  }
};

const getLocation = async (id) => {
  const location = await locationModel.findById(id);
  return location;
};

const getAllLocation = async (userId) => {
  const location = await locationModel.find(userId);
  return location;
};

const getLocationByProProfileId = async (proProfileId) => {
  const location = await locationModel.find({ proProfileId: proProfileId });
  return location;
};

const getLocationByUserProfileId = async (userProfileId) => {
  const location = await locationModel.find({ userProfileId: userProfileId });
  return location;
};

const addProfessionalLocation = async (locations) => {
  const { latitude, longitude, locationName, proProfileId } = locations;
  const location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
    locationName: locationName,
  };

  const profile = await proProfileModel
    .findByIdAndUpdate(
      { _id: proProfileId },
      {
        $set: {
          currentLocation: location,
          latitude: latitude,
          longitude: longitude,
        },
      },
      { new: true }
    )
    .select("-password");
  return profile;
};

const updateSelectedProfessionalLocation = async (req) => {
  const { locationId, proProfileId } = req.body;

  const locations = await locationModel.findOne({
    _id: locationId,
    proProfileId: proProfileId,
  });

  await locationModel.updateMany(
    { proProfileId: proProfileId },
    { $set: { isSelected: false } }
  );
  locations.isSelected = true;
  const result = await locations.save();

  return result;
};

const addUserLocation = async (locations) => {
  const { latitude, longitude, locationName, userProfileId } = locations;
  const location = {
    type: "Point",
    coordinates: [parseFloat(longitude), parseFloat(latitude)],
    locationName: locationName,
  };

  const profile = await userProfileModel
    .findByIdAndUpdate(
      { _id: userProfileId },
      {
        $set: {
          currentLocation: location,
          latitude: latitude,
          longitude: longitude,
        },
      },
      { new: true }
    )
    .select("-password");
  return profile;
};

const updateSelectedUserLocation = async (req) => {
  const { locationId, userProfileId } = req.body;

  const locations = await locationModel.findOne({
    _id: locationId,
    userProfileId: userProfileId,
  });

  await locationModel.updateMany(
    { userProfileId: userProfileId },
    { $set: { isSelected: false } }
  );
  locations.isSelected = true;
  const result = await locations.save();

  return result;
};
module.exports = {
  createLocation,
  updateLocation,
  deleteLocation,
  getLocation,
  getAllLocation,
  getLocationByProProfileId,
  getLocationByUserProfileId,
  addProfessionalLocation,
  updateSelectedProfessionalLocation,
  addUserLocation,
  updateSelectedUserLocation,
  createLocationByOtp
};
