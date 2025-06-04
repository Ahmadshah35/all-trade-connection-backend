const proModel = require("../models/proProfile");

const updateProProfile = async (id, userData, files) => {
  const existingProfile = await proModel.findById(id);
  if (!existingProfile) throw new Error("Profile not found");

  const existingCertificates = existingProfile.certificate || [];
  const newCertificateNames = files?.certificate?.map(file => file.filename) || [];

  const retainedCertificates = existingCertificates.filter(file => newCertificateNames.includes(file));
  const addedCertificates = newCertificateNames.filter(file => !existingCertificates.includes(file));
  userData.certificate = [...retainedCertificates, ...addedCertificates];

  if (files?.image?.length) {
    userData.image = files.image[0].filename;
  } else {
    userData.image = existingProfile.image || null;
  }

   if (userData.includingTheseDays) {
  // if includingTheseDays is an array of strings, check if first element is a JSON string
  if (Array.isArray(userData.includingTheseDays) && userData.includingTheseDays.length === 1) {
    try {
      const parsed = JSON.parse(userData.includingTheseDays[0]);
      if (Array.isArray(parsed)) {
        userData.includingTheseDays = parsed;
      }
    } catch (err) {
      // parsing failed, leave it as is
    }
  } else if (typeof userData.includingTheseDays === "string") {
    // if it's a single string (not in array), try parse it too
    try {
      const parsed = JSON.parse(userData.includingTheseDays);
      if (Array.isArray(parsed)) {
        userData.includingTheseDays = parsed;
      }
    } catch (err) {
      // parsing failed, leave as is
    }
  }
} else {
  userData.includingTheseDays = existingProfile.includingTheseDays || [];
}

  const updatedProfile = await proModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  );

  return updatedProfile;
};


const updateAvgRating = async (id,avgRating) => {

  const updatedProfile = await proModel.findByIdAndUpdate(
    id,
     {$set:{avgRating:avgRating}
     },
    { new: true }
  );
  return updatedProfile;
}


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
  const { latitude, longitude, category } = req.body;
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
  const result = await proModel.find(filter).select("-password")
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
  updateAvgRating
};
