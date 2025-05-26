const supportModel = require("../models/support");

const createSupport = async (req) => {
  const create = new supportModel(req.body);
  const result = await create.save();
  return result;
};

const getSupport = async (id) => {
  const get = await supportModel.findById({ _id: id });
  return get;
};

const getAllSupport = async (req) => {
  const getAll = await supportModel.find();
  return getAll;
};


module.exports = {
  createSupport,
  getSupport,
  getAllSupport
}