const projectModel = require("../models/project");

const createProject = async (req) => {
  req.body.location = {
    type: "Point",
    coordinates: [
      parseFloat(req.body.longitude),
      parseFloat(req.body.latitude),
    ],
    locationName: req.body.locationName,
  };
  const { selectDate, ...otherData } = req.body;

  const project = new projectModel({
    ...otherData,
    selectDate: selectDate ? new Date(selectDate) : null,
    images: req.files.map((file) => file.filename),
  });

  const result = await project.save();
  return result
};

const updateProject = async (id, userData, files) => {

  const existingProject = await projectModel.findById(id);

  if (files?.images?.length) {
    const existingImages = existingProject.images || [];
    const newImageNames = files.images.map((file) => file.filename);

    const retainedImages = existingImages.filter((img) => newImageNames.includes(img));

    const addedImages = newImageNames.filter((img) => !existingImages.includes(img));

    userData.image = [...retainedImages, ...addedImages];
  } else {
    userData.image = [];
  }

  const result = await projectModel.findByIdAndUpdate(
    id,
    { $set: { ...userData } },
    { new: true }
  );

  return result;
};


const deleteProject = async (id) => {
  const project = await projectModel.findByIdAndDelete(id);
  return project;
};

const getProject = async (id) => {
  const project = await projectModel.findById(id, { isDeleted: false }).populate({path:"asignTo",select:"-password"}).populate({path :"userProfileId", select:"-password"});
  return project;
};

const getAllProject = async (req) => {
  const { userProfileId } = req.query;
  const projects = await projectModel.find({
    userProfileId: userProfileId,
    isDeleted: false,
  });
  return projects;
};

const updateStatus = async (id, status) => {
  const project = await projectModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  return project;
};

const updateProjectStatusAndAsignTo = async (projectId, ProProfileId) => {
  const project = await projectModel.findByIdAndUpdate(
    {_id : projectId },
    { $set: { status: "Hired", asignTo: ProProfileId } },
    { new: true }
  );
  return project;
};

const getProjectCategory = async (req) => {
  const { category } = req.query;
  const project = await projectModel.find({
    category:{ $in : category},
    isDeleted: false,
  })
  // .populate({
  //   path:"userProfileId",
  //   select:"-password"
  // });
  return project;
};

const getStatus = async (status) => {
  const project = await projectModel.find({ status: status, isDeleted: false });
  return project;
};

const getProjectByLocationAndCategory = async (req) => {
  const { category, longitude, latitude } = req.query;
  const filter = {};

  if (category) {
    filter.category ={$in: category};
  }

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

  const result = await projectModel.find(filter)
  // .populate({
  //   path: "userProfileId",
  //   select: "-password",
  // });

  return result;
};


const getProjectByLocation = async (req) => {
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
  const result = await projectModel.find(filter)
  // .populate({
  //   path: "userProfileId",
  //   select: "-password",
  // });

  return result;
};


const getProjectByStatusAndProProfileId = async (asignTo, status) => {
  const project = await projectModel.find({
    asignTo: asignTo,
    status: status,
    isDeleted: false,
  }).populate({
    path: "asignTo",
    select: "-password",
  }).populate({
    path:"userId",
    select:"-password"
  });
  return project;
};

const getProjectByStatusAndUserId = async (userProfileId, status) => {
  const project = await projectModel.find({
    userProfileId: userProfileId,
    status: status,
    isDeleted: false,
  }).populate({
    path: "userId",
    select: "-password",
  }).populate({
    path:"asignTo",
    select:"-password"
  });
  return project;

}

const getProjectByUserProfileId = async (userId) => {
  const project = await projectModel.find({
    userId: userId,
    isDeleted: false,
  });
  return project;
};


const searchProject = async (req) => {
  const { titleName, category } = req.body;
  const filter = {};
  if(titleName){
      filter.titleName = { $regex: `^${titleName}$`, $options: 'i' }
  }
  if(category){
      filter.category = category
  }
  const result = await projectModel.find(filter)
  return result;
};

const updateProjectStatusByProjectId = async (projectId) => {
  const project = await projectModel.find({
    _id: projectId,
    status: "Hired",
    isDeleted: false,
  });
  return project;
};


module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getAllProject,
  updateStatus,
  getProjectCategory,
  getStatus,
  getProjectByLocationAndCategory,
  getProjectByLocation,
  getProjectByStatusAndProProfileId,
  getProjectByStatusAndUserId,
  updateProjectStatusAndAsignTo,
  searchProject,
  updateProjectStatusByProjectId,
  getProjectByUserProfileId
};
