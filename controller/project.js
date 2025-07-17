const { default: mongoose } = require("mongoose");
const func = require("../functions/project");
const profileModel = require("../models/userProfile");
const proposalFunc = require("../functions/proposal");
const notificationFunc = require("../functions/notification");
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
    if (!user) {
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
    } else {
      const userId = project.userProfileId;
      const projectId = project._id;
      const category = project.category;
      const message = `New Project has been created.`;
      const type = `Project`;

      const notification =
        await notificationFunc.createNotificationForProjectCreation(
          userId,
          projectId,
          category,
          type,
          message
        );

      return res
        .status(200)
        .json({ status: "success", data: project, success: true });
    }
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
    } else {
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
    const { id, status, inDiscussionPro } = req.body;
    let project;

    if (status === "In-Discussion") {
      project = await func.updateProIdOrStatus(id, status, inDiscussionPro);
    } else {
      project = await func.updateStatus(id, status);
    }

    if (project) {
      const proId = project.asignTo;
      const projectId = project._id;
      const userId = project.userProfileId;
      const category = project.category;
      const message = `New update on your Proposal! Status: ${project.status}`;
      const type = `Project`;

      await notificationFunc.createNotificationForProjectStatus(
        userId,
        proId,
        projectId,
        category,
        type,
        message
      );

      return res.status(200).json({
        status: "success",
        data: project,
        success: true,
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Update status failed",
        success: false,
      });
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
      return res.status(200).json({
        status: "failed",
        message: "Delete project failed",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(400).json({
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
    if (!project) {
      return res.status(200).json({
        status: "failed",
        message: "project not found",
        success: false,
      });
    } else {
      // const proposals = await proposalFunc.getProposalByProjectId(project._id)
      return res
        .status(200)
        .json({ status: "successful", data: project, success: true });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(400).json({
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
    return res.status(400).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getProjectByLocationAndCategory = async (req, res) => {
  try {
    const project = await func.getProjectByLocationAndCategory(req);
    if (project.length == 0) {
      return res.status(200).json({
        status: "failed",
        message: "Project not found",
        success: false,
      });
    } else {
      return res
        .status(200)
        .json({ message: "projects", data: project, success: true });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(400).json({
      status: "failed",
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getProjectByStatusOrProfileId = async (req, res) => {
  try {
    const { _id, type } = req.user;
    const { status } = req.query;

    let projects;

    if (type === "User") {
      if (status) {
        projects = await func.getProjectByStatusAndUserId(_id, status);
      } else {
        projects = await func.getAllProject(_id);
      }
    } else if (type === "Professional") {
      projects = await func.getProjectByStatusAndProProfileId(_id, status);
    } else {
      return res.status(200).json({
        status: "failed",
        success: false,
        message: "Invalid user type",
      });
    }

    if (!projects || projects.length === 0) {
      return res.status(200).json({
        status: "failed",
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: "successful",
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(400).json({
      status: "failed",
      success: false,
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
  updateStatus,
  getProjectByStatus,
  getProjectByLocationAndCategory,
  getProjectByStatusOrProfileId,
};
