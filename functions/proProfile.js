const proModel = require("../models/proProfile");

const updateProProfile = async (id, userData, files) => {
  const existingProfile = await proModel.findById(id);
  if (!existingProfile) throw new Error("Profile not found");
  if (files?.certificate?.length) {
    const existingCertificates = existingProfile.certificate || [];
    const newCertificateNames =
      files?.certificate?.map((file) => file.filename) || [];

    const retainedCertificates = existingCertificates.filter((file) =>
      newCertificateNames.includes(file)
    );
    const addedCertificates = newCertificateNames.filter(
      (file) => !existingCertificates.includes(file)
    );
    userData.certificate = [...retainedCertificates, ...addedCertificates];
  } else {
    userData.certificate = existingProfile.certificate;
  }
  if (files?.image?.length) {
    userData.image = files.image[0].filename;
  } else {
    userData.image = existingProfile.image || null;
  }

  if (userData.workingDays) {
    // if includingTheseDays is an array of strings, check if first element is a JSON string
    if (
      Array.isArray(userData.workingDays) &&
      userData.workingDays.length === 1
    ) {
      try {
        const parsed = JSON.parse(userData.workingDays[0]);
        if (Array.isArray(parsed)) {
          userData.workingDays = parsed;
        }
      } catch (err) {
        // parsing failed, leave it as is
      }
    } else if (typeof userData.workingDays === "string") {
      // if it's a single string (not in array), try parse it too
      try {
        const parsed = JSON.parse(userData.workingDays);
        if (Array.isArray(parsed)) {
          userData.workingDays = parsed;
        }
      } catch (err) {
        // parsing failed, leave as is
      }
    }
  } else {
    userData.workingDays = existingProfile.workingDays || [];
  }
  if (userData.category) {
    userData.category = JSON.parse(userData.category);
  }

  const updatedProfile = await proModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  );

  return updatedProfile;
};

const updateAvgRating = async (id, avgRating) => {
  const updatedProfile = await proModel.findByIdAndUpdate(
    id,
    { $set: { avgRating: avgRating } },
    { new: true }
  );
  return updatedProfile;
};

const proProfileCreated = async (proProfileId) => {
  const profile = await proModel.findByIdAndUpdate(
    proProfileId,
    { $set: { profileCreated: true } },
    { new: true }
  );
  // console.log(profile)
  return profile;
};

const getProProfile = async (id) => {
  const profile = await proModel.findById(id, { isDeleted: false });
  return profile;
};

const getAllProProfile = async (req) => {
  const profile = await proModel.find({ isDeleted: false }).select("-password");
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
  const { latitude, longitude, category, fullName } = req.body;
  // console.log("first",req.query)
  const filter = {};
  if (fullName) {
    filter.$expr = {
      $regexMatch: {
        input: { $concat: ["$firstName", " ", "$lastName"] },
        regex: fullName,
        options: "i" 
      }
    };
  }

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
  const result = await proModel.find(filter).select("-password");
  return result;
};

const getProProfiletByLocation = async (req) => {
  const { longitude, latitude } = req.query;
  const filter = {};

  if (longitude && latitude) {
    filter.currentLocation = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: 10000, // 10 km
      },
    };
  }

  const result = await proModel.find(filter).select("-password");
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

module.exports = {
  updateProProfile,
  getProCategory,
  getProProfile,
  getProProfileByProId,
  getProProfileByLocationAndCategory,
  updateIncludingTheseDays,
  proProfileCreated,
  getProProfiletByLocation,
  updateAvgRating,
  getAllProProfile,
};
