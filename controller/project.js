const { default: mongoose } = require("mongoose");
const func = require("../functions/project");
const profileModel = require("../models/userProfile");
 

const createProject = async (req, res) => {
  try {
    const { userProfileId } = req.body;

    if (!req.files?.length) {
      res.status(200).json({
        status: "failed",
        message: " At least one file is required",
        success: false,
      });
    }
    if (!userProfileId) {
      res.status(200).json({
        status: "failed",
        message: "User ID is required",
        success: false,
      });
    }

    const user = await profileModel.findById(userProfileId);
    if (!user ) {
      res.status(200).json({
        status: "failed",
        message: " user not found",
        success: false,
      });
    }
    // console.log("first",userId)
    const project = await func.createProject(req);
    if (!project) {
      res.status(200).json({
        status: "failed",  
        message: "project not saved", 
        success: false,
      });
    }

    return res.status(201).json({ status: "success", data: project, success: true });

   
  } catch (error) {
    console.error(" error :", error);
    res
      .status(400)
      .json({ status: "failed", message: error.message, success: false });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id, ...userData } = req.body;

    if (!id) {
      return res.status(200).json({
        status: "failed",
        message: "Project ID is required",
        success: false,
      });
    }

    const existingProject = await func.getProject(id); 
    if (!existingProject) {
      return res.status(200).json({
        status: "failed",
        message: "Project not found",
        success: false,
      });
    }

    const project = await func.updateProject(id, userData, req.files);

    if (!project) {
      return res.status(200).json({
        status: "failed",
        message: "Project not saved",
        success: false,
      });
    }else{

    return res.status(200).json({
      status: "success",
      data: project,
      success: true,
    });
  }

  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({
      status: "failed",
      message: error.message,
      success: false,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const project = await func.updateStatus(id, status);

    if (project) {
      return res.status(200).json({ status: "success", data: project, success: true });
 } else {
      return res
        .status(400)
        .json({ status: "failed", message: "Update status failed", success: false });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.body;
    const project = await func.deleteProject(id);

    if (project) {
      return res
        .status(200)
        .json({ message: "Deleted successfully", success: true });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "Delete project failed", success: false });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.query;
    const project = await func.getProject(id);

    if (project.length == 0) {
      return res
        .status(200)
        .json({ status: "failed", message: "invalid Id", success: false });
    } else {
      return res
        .status(200)
        .json({ status: "successful", data: project, success: true });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getAllProject = async (req, res) => {
  try {
    const projects = await func.getAllProject(req);

    if (projects.length == 0) {
      return res
        .status(200)
        .json({ status: "failed", message: "invalid Id", success: false });
    } else {
      return res
        .status(200)
        .json({ status: "successful", data: projects, success: true });
    }
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


const getProjectByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const project = await func.getStatus(status);

    if (!project) {
      return res.status(200).json({
        status: "failed",
        message: "Project not found",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ status: "successful", data: project, success: true });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getProjectByLocationAndCategory = async (req, res) => {
  try {
    const { category, latitude, longitude } = req.query;
    if (category && latitude && longitude) {
      const project = await func.getProjectByLocationAndCategory(req);
      if (project) {
        return res
          .status(200)
          .json({ message: "projects", data: project, success: true });
      }
    } else if (category) {
      
      const categorys = await func.getProjectCategory(req);

      if (categorys) {
        return res
          .status(200)
          .json({ message: "projects", data: categorys, success: true });
      } 
    } else if (latitude && longitude) {
      const project = await func.getProjectByLocation(req);
      if (project) {
        return res
          .status(200)
          .json({ message: "projects", data: project, success: true });
      }
    } else {
      return res.status(200).json({
        status: "failed",
        message: "Project not found",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getProjectByStatusProProfileId = async (req, res) => {
  try {
    const { status, asignTo } = req.query;
    const project = await func.getStatusByProProfileId(asignTo, status);

    if (!project) {
      return res.status(200).json({
        status: "failed",
        message: "Project not found",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ status: "successful", data: project, success: true });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getProjectByStatusAndUserId = async (req, res) => {
  try {
    const { status, userProfileId } = req.query;
    const project = await func.getProjectByStatusAndUserId(userProfileId, status);

    if (!project) {
      return res.status(200).json({
        status: "failed",
        success: false,
        message: "Project not found",
        success: false,
      });
    }

    return res
      .status(200)
      .json({ status: "successful", data: project, success: true });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      status: "failed"
      , success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};



module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getAllProject,
  updateStatus,
  getProjectByStatus,
  getProjectByLocationAndCategory,
  getProjectByStatusProProfileId,
  getProjectByStatusAndUserId,
};
