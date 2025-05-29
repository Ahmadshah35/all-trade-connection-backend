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
  const proposal = await proposalModel.findById(id).populate({
    path :"proProfileId",
    select:"-password"
  });
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
  }).populate({
    path:"proProfileId",
    select:"-password"
  }).populate({
    path:"projectId"
  });
  // console.log("first",proposal)
  return proposal;
};

const getProposalByProjectIdOrStatus = async (req) => {
  const {projectId,status} = req.query
  const filter = {projectId}
  if(status){
    filter.status = status
  }
  const proposal = await proposalModel.find(filter).populate({
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
  getProposalByProjectIdOrStatus,
};
