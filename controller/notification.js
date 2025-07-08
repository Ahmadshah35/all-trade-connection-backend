const { default: mongoose } = require("mongoose");
const func = require("../functions/notification");

const getAllNotifications = async (req, res) => {
  try {
   const {_id , type} = req.user
   if(type == "User"){
 const notification = await func.getAllNotificationOfUser(_id);
    if (notification.length == 0) {
      res
        .status(200)
        .json({ message: "notification not found", success: false });
    } else {
      res
        .status(200)
        .json({ message: " sucessfully ", data: notification, success: true });
    }
   }
   if(type == "Professional"){
    const notification = await func.getAllNotificationOfProfessional(_id);
    if (notification.length == 0) {
      res
        .status(200)
        .json({ message: "notification not found", success: false });
    } else {
      res
        .status(200)
        .json({ message: " sucessfully ", data: notification, success: true });
    }
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
  getAllNotifications,
  deleteNotification,
};
