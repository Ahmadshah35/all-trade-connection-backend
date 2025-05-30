const notificationModel = require("../models/notification");

const createNotificationForProjectCreation = async (userId,projectId,category,type,message) => {
  const notification = new notificationModel({
        userId:userId,
        projectId:projectId,
        category:category,
        type: type,
        message:message
  });
  const result = await notification.save();
  return result;
};

const createNotificationForProjectStatus = async (userId,proId,projectId,category,type,message) => {
  const notification = new notificationModel({
        userId:userId,
        proId:proId,
        projectId:projectId,
        category:category,
        type: type,
        message:message
  });
  const result = await notification.save();
  return result;
};

const createNotificationForProposal = async (proId,projectId,proposalId,type,message) => {
  const notification = new notificationModel({
        proId: proId,
        projectId:projectId,
        proposalId: proposalId,
        type: type,
        message:message
  });
  const result = await notification.save();
  return result;
};

const getAllNotificationOfUser = async (req) => {
  const { userId } = req.query;
  const notification = await notificationModel.find({ userId: userId }).populate({
    path:"userId",
    select:"-password"
  }).populate({
    path:"category"
  });
  return notification;
};

const getAllNotificationOfProfessional = async (req) => {
  const { proId } = req.query;
  const notification = await notificationModel.find({ proId: proId }).populate({
    path:"proId",
    select:"-password"
  });
  return notification;
};

const deleteNotification = async (req) => {
  const { id } = req.body;
  const notification = await notificationModel.findByIdAndDelete({ _id: id });
  return notification;
};

module.exports = {
  createNotificationForProjectCreation,
  createNotificationForProjectStatus,
  getAllNotificationOfUser,
  getAllNotificationOfProfessional,
  deleteNotification,
  createNotificationForProposal
};
