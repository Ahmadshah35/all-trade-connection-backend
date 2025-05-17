const mongoose = require("mongoose");
const reportModel = require("../models/report");

const reportedByPro = async (req, res) => {
  try {
    const { reportedByPro, reportedProject, reason } = req.body;

    if (!reportedByPro || !reportedProject || !reason) {
      return res
        .status(200)
        .json({ error: "All required fields must be filled.", sucess: false });
    }
    const report = new reportModel({
      reportedByPro,
      reportedProject,
      reason,
    });
    await report.save();
    return res.status(201).json({
      message: "Report submitted successfully.",
      data: report,
      sucess: true,
    });
  } catch (error) {
    console.error("Error in reporting user:", error);
    return res
      .status(500)
      .json({
        error: "Internal server error",
        sucess: false,
        error: error.message,
      });
  }
};

const reportedByUser = async (req, res) => {
  try {
    const { reportedByUser, reportedPro, reason } = req.body;

    if (!reportedByUser || !reportedPro || !reason) {
      return res
        .status(200)
        .json({ error: "All required fields must be filled.", sucess: false });
    }
    const report = new reportModel({
      reportedByUser,
      reportedPro,
      reason,
    });
    await report.save();
    return res.status(201).json({
      message: "Report submitted successfully.",
      data: report,
      sucess: true,
    });
  } catch (error) {
    console.error("Error in reporting user:", error);
    return res
      .status(500)
      .json({
        error: "Internal server error",
        sucess: false,
        error: error.message,
      });
  }
};

module.exports = {
  reportedByPro,
  reportedByUser
};
