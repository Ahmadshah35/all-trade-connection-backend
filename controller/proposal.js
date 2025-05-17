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
        .json({ status: "proposal already exist", sucess: true });
    }else{
    const proposal = await func.createProposal(req);

    if (proposal) {
      return res
        .status(200)
        .json({ status: "sucess", data: proposal, sucess: true });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "incorrect data", sucess: false });
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
      res.status(200).json({ status: "sucess", data: proposal, sucess: true });

      return;
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "update failed", sucess: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
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
        .json({ message: "deleted sucessfully", data: proposal, sucess: true });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "delete failed", sucess: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
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
        .json({ status: "incorrect credentials", sucess: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: proposal, sucess: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
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
      return res.status(200).json({
        message: "sucessfuly Accept",
        Data: proposal,
        projectData: updateProject,
        sucess: true,
      });
    } else if (proposal.status == "Reject") {
      
      return res.status(200).json({
        message: "  proposal rejected sucessfully",
        data: proposal,
        sucess: true,
      });
    } else {
      return res
        .status(200)
        .json({ message: "invalid Status ", sucess: false });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "something went wrong ", sucess: false });
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
      return res.status(200).json({ status: "proposal not found" });
    } else {
      return res.status(200).json({ status: "sucessful", data: proposal });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "failed", message: "something went wrong" });
  }
};

const getProposalByProjectId = async (req, res) => {
  try {
    const { projectId } = req.query;
    const proposal = await func.getProposalByProjectId(projectId);
    if (proposal.length == 0) {
      return res.status(200).json({ status: "proposal not found" });
    } else {
      return res.status(200).json({ status: "sucessful", data: proposal });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "failed", message: "something went wrong" });
  }
};

module.exports = {
  createProposal,
  updateProposal,
  deleteProposal,
  getProposal,
  updateProposalStatus,
  getProposalByStatusAndProProfileId,
  getProposalByProjectId,
};
