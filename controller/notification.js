const { default: mongoose } = require("mongoose");
const func = require("../functions/notification");

const getAllNotificationOfProfessional = async (req, res) => {
  try {
    const notification = await func.getAllNotificationOfProfessional(req);
    if (notification.length == 0) {
      res
        .status(200)
        .json({ message: "notification not found", success: false });
    } else {
      res
        .status(200)
        .json({ message: " sucessfully ", data: notification, success: true });
    }
  } catch (error) {
    res.status(200).json({ message: "something went wrong", success: false });
  }
};

const getAllNotificationOfUser = async (req, res) => {
  try {
    const notification = await func.getAllNotificationOfUser(req);
    if (notification.length == 0) {
      res
        .status(200)
        .json({ message: "notification not found", success: false });
    } else {
      res
        .status(200)
        .json({ message: " sucessfully ", data: notification, success: true });
    }
  } catch (error) {
    res.status(200).json({ message: "something went wrong", success: false });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await func.deleteNotification(req);
    if (!notification) {
      res.status(200).json({ message: "delete failed", success: false });
    } else {
      res.status(200).json({
        message: "sucessfully deleted",
        success: true,
      });
    }
  } catch (error) {
    
    res.status(200).json({ message: "something went wrong", success: false , error: error.message})
  }
};

module.exports = {
  getAllNotificationOfUser,
  getAllNotificationOfProfessional,
  deleteNotification,
};
