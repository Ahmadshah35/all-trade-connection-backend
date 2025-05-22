const proposalModel = require("../models/proposal");

const createProposal = async (req) => {
  const proposal = new proposalModel(req.body);
  const result = await proposal.save();
  return result;
};

const updateProposal = async (id, userData) => {
  const proposal = await proposalModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  );
  return proposal;
};

const deleteProposal = async (id) => {
  const proposal = await proposalModel.findByIdAndDelete(
    { _id: id },
    {
      new: true,
    }
  );
  return proposal;
};

const getProposal = async (id) => {
  const proposal = await proposalModel.findById(id);
  return proposal;
};

const updateProposalStatus = async (req) => {
  const { proposalId, status } = req.body;
  const type = await proposalModel.findByIdAndUpdate(
    { _id: proposalId },
    { $set: { status: status } },
    { new: true }
  );
  return type;
};

const getProposalByStatusAndProProfileId = async (proProfileId, status) => {
  const proposal = await proposalModel.find({
    proProfileId: proProfileId,
    status: status,
  });
  // console.log("first",proposal)
  return proposal;
};

const getProposalByProjectId = async (projectId) => {
  const proposal = await proposalModel.find({ projectId: projectId, status:"Pending" }).populate({
    path :"proProfileId",
    select:"-password"
  });
  // console.log("first",proposal)
  return proposal;
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
