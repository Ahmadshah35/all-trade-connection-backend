const proModel = require("../models/proProfile");

const updateProProfile = async (req,id, userData, files) => {
  const existingProfile = await proModel.findById(id);
  if (!existingProfile) {
    console.log("Profile not found");
  } else {
    const newPortfolio = Array.isArray(files["portfolio"])
      ? files["portfolio"].map((file) => file.filename)
      : [];
    const newCertificate = Array.isArray(files["certificate"])
      ? files["certificate"].map((file) => file.filename)
      : [];

    userData.portfolio = Array.isArray(existingProfile.portfolio)
      ? [...existingProfile.portfolio, ...newPortfolio]
      : newPortfolio;

    userData.certificate = Array.isArray(existingProfile.certificate)
      ? [...existingProfile.certificate, ...newCertificate]
      : newCertificate;

    const updatedProfile = await proModel.findByIdAndUpdate(
      id,
      { $set:  {...userData,
        image: req.files.image?.[0]?.filename || null,
      }
       },
      { new: true }
    );
    return updatedProfile;
  }
};

const proProfileCreated = async (proProfileId) => {
  const profile = await proModel.findByIdAndUpdate(proProfileId,
    { $set:{profileCreated: true}},
    { new: true }
  );
  // console.log(profile)
  return profile;
};


const getProProfile = async (id) => {
  const profile = await proModel.findById(id, { isDeleted: false });
  return profile;
};

const getProCategory = async (req) => {
  const { category } = req.query;
  const project = await proModel
    .find({ category: category })
    .select("-password");
  return project;
};

const getProProfileByProId = async (proId) => {
  const get = await proModel.findOne({ proId: proId });
  return get;
};

const getProProfileByLocationAndCategory = async (req) => {
  const { latitude, longitude, category } = req.query;
  // console.log("first",req.query)
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (longitude && latitude) {
    filter.currentLocation = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: 100000,
      },
    };
  }
  // console.log("first",filter)
  const result = await proModel.find(filter).populate({
    path: "proProfileId",
    select: "-password",
  });

  return result;
};
const getProProfiletByLocation = async (req) => {
  const { longitude, latitude } = req.query;
  const filter = {};

  if (longitude && latitude) {
    filter.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: 10000,
      },
    };
  }

  const result = await proModel.find(filter).populate({
    path: "proProfileId",
    select: "-password",
  });

  return result;
};


const updateIncludingTheseDays = async (id, newDays) => {
  const profile = await proModel.findById(id);
  if (!profile) return null;

  const currentDays = profile.includingTheseDays || [];
  const addDays = [];
  const removeDays = [];

  for (const day of newDays) {
    if (currentDays.includes(day)) {
      removeDays.push(day);
    } else {
      addDays.push(day);
    }
  }

  const update = {};
  if (removeDays.length)
    update.$pull = { includingTheseDays: { $in: removeDays } };
  if (addDays.length)
    update.$addToSet = { includingTheseDays: { $each: addDays } };

  if (!Object.keys(update).length) return profile;

  const updatedDoc = await proModel.findByIdAndUpdate(id, update, {
    new: true,
  });
  return updatedDoc;
};
;

module.exports = {
  updateProProfile,
  getProCategory,
  getProProfile,
  getProProfileByProId,
  getProProfileByLocationAndCategory,
  updateIncludingTheseDays,
  proProfileCreated,
  getProProfiletByLocation
};
