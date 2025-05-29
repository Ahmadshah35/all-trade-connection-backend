const { default: mongoose } = require("mongoose");
const func = require("../functions/proposal");
const proposalModel = require("../models/proposal");
const projectFunc = require("../functions/project");

const createProposal = async (req, res) => {
  const { projectId, proProfileId } = req.body;
  const validiate = await proposalModel.findOne({
    projectId: projectId,
    proProfileId: proProfileId,
  });
  try {
    if (validiate) {
      return res
        .status(200)
        .json({ status: "proposal already exist", success: true });
    }else{
    const proposal = await func.createProposal(req);

    if (proposal) {
      return res
        .status(200)
        .json({ status: "sucess", data: proposal, success: true });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "incorrect data", success: false });
    }
  }
  } catch (error) {
    console.error("Transaction failed:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const updateProposal = async (req, res) => {
  try {
    const { id } = req.body;
    const userData = req.body;
    const proposal = await func.updateProposal(id, userData);

    if (proposal) {
      res.status(200).json({ status: "sucess", data: proposal, success: true });

      return;
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "update failed", success: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};
const deleteProposal = async (req, res) => {
  try {
    const { id } = req.body;
    const proposal = await func.deleteProposal(id);
    if (proposal) {
      return res
        .status(200)
        .json({ message: "deleted sucessfully", success: true });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "delete failed", success: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const getProposal = async (req, res) => {
  try {
    const { id } = req.query;
    const proposal = await func.getProposal({ _id: id });
    if (proposal.length == 0) {
      return res
        .status(200)
        .json({ status: "incorrect credentials", success: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: proposal, success: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const updateProposalStatus = async (req, res) => {
  try {
    // const { proposalId, status } = req.body;
    const proposal = await func.updateProposalStatus(req);
    if (proposal.status == "Accept") {
      const proProfileId = proposal.proProfileId;
      const projectId = proposal.projectId;
      const updateProject = await projectFunc.updateProjectStatusAndAsignTo(
        projectId,
        proProfileId
      );
      const updateProjectStatus= await  projectFunc.updateProjectStatusByProjectId(projectId)
      return res.status(200).json({
        message: "sucessfuly Accept",
        Data: proposal,
        projectData: updateProject,
        success: true,
      });
    } else if (proposal.status == "Reject") {
      
      return res.status(200).json({
        message: " proposal rejected sucessfully",
        data: proposal,
        success: true,
      });
    } else {
      return res
        .status(200)
        .json({ message: "invalid Status ", success: false });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "something went wrong ", success: false });
  }
};

const getProposalByStatusAndProProfileId = async (req, res) => {
  try {
    const { proProfileId, status } = req.query;
    const proposal = await func.getProposalByStatusAndProProfileId(
      proProfileId,
      status
    );
    if (proposal.length == 0) {
      return res.status(200).json({ status: "proposal not found",data:proposal, success: false });
    } else {
      return res.status(200).json({ status: "sucessful", data: proposal, success: true });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "failed", message: "something went wrong", success: false });
  }
};

const getProposalByProjectIdOrStatus = async (req, res) => {
  try {
    // const { projectId } = req.query;
    const proposal = await func.getProposalByProjectIdOrStatus(req);
    if (proposal.length == 0) {
      return res.status(200).json({ status: "proposal not found", data :proposal, success: false });
    } else {
      return res.status(200).json({ status: "sucessful", data: proposal, success: true });
    }
  } catch (error) {
    console.log("error", error.message)
    return res
      .status(400)
      .json({ status: "failed", message: "something went wrong", success: false });
  }
};

module.exports = {
  createProposal,
  updateProposal,
  deleteProposal,
  getProposal,
  updateProposalStatus,
  getProposalByStatusAndProProfileId,
  getProposalByProjectIdOrStatus,
};
