const func = require("../functions/support");

const createSupport = async (req, res) => {
  try {
    const create = await func.createSupport(req);
    if (!create) {
      res.status(200).json({
        success: false,
        message: "error in creating support message ",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "sucessfully created ",
        data: create,
      });
    }
  } catch (error) {
    console.log("error", error.message);
    res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const getSupport = async (req, res) => {
  try {
    const { id } = req.query;
    const get = await func.getSupport(id);
    if (!get) {
      res.status(200).json({
        success: false,
        message: "support not found ",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "sucessfully get ",
        data: get,
      });
    }
  } catch (error) {
    console.log("error", error.message);
    res.status(400).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

const getAllSupport = async (req, res) => {
  try {
    const getAll = await func.getAllSupport(req);
    if (getAll.length == 0) {
      res.status(200).json({
        success: false,
        message: "support not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successfull",
        data: getAll,
      });
    }
  } catch (error) {
    console.log("error", error.message);
    res.status(400).json({
      success: false,
      message: "something went wrong ",
      error: error.message,
    });
  }
};


module.exports={
  createSupport,
  getSupport,
  getAllSupport
}