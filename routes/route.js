const express = require("express");
const userController = require("../controller/auth");
const otpController = require("../controller/otp");
const locationController = require("../controller/location")
const profileController = require("../controller/profile")
const proProfileController = require("../controller/proProfile")
const projectController = require("../controller/project")
const adminController = require("../controller/admin")
const proposalController = require("../controller/proposal")
const categoryController = require("../controller/category")
const reviewController = require("../controller/review")
const reportController = require("../controller/report")
const supportController= require("../controller/support")
const notificationController = require("../controller/notification")
const { profileUpload, upload, projectUpload } = require("../middleware/upload");
const router = express.Router();

//Auth
router.post( "/signUp", userController.signUp);
router.post("/login", userController.login);
router.post("/deleteUser", userController.deleteUser);
router.post("/deletePro", userController.deletePro);
router.post("/setNewPassword", userController.setNewPassword);
router.post("/resetPassword",userController.resetPassword)

//Otp
router.post("/verifyOtp", otpController.verifyOtp);
router.post("/resendOtp", otpController.resendOtp);

//Category
router.post("/createCategory",categoryController.createCategory );
router.post("/deleteCategory",categoryController.deleteCategory );
router.get("/getAllCategory",categoryController.getAllCategory );
router.get("/getCategory",categoryController.getCategory );

// Profile And ProProfile
router.post( "/updateProfile", upload.fields([{ name: "certificate", maxCount: 4 },{ name : "image" , maxCount: 1 }]), profileController.upadateProfile);
router.get("/getProfile", profileController.getProfile);
router.get("/getAllProfile", profileController.getAllProfile);
router.get("/getAllProProfile", proProfileController.getAllProProfile); 
router.get("/getProCategory", proProfileController.getProCategory);
router.post("/updateIncludingTheseDays", proProfileController.updateIncludingTheseDays);
router.post("/getProProfileByLocationAndCategory",proProfileController.getProProfileByLocationAndCategory);
router.post("/updateProfessionalIsActive",proProfileController.updateProfessionalIsActive);

//Project
router.post("/createProject", projectUpload.array("images",4),projectController.createProject);
router.post("/updateProject",projectUpload.fields([{ name : "images" ,maxCount: 4}]),projectController.updateProject); 
router.post("/updateStatus", projectController.updateStatus); 
router.post("/deleteProject", projectController.deleteProject);
router.get("/getProject", projectController.getProject);
router.get("/getAllProject", projectController.getAllProject);
router.get("/getProjectByStatus", projectController.getProjectByStatus);
router.post("/getProjectByLocationAndCategory",projectController.getProjectByLocationAndCategory);
router.get("/getProjectByStatusProProfileId",projectController.getProjectByStatusProProfileId );
router.get("/getProjectByStatusAndUserId",projectController.getProjectByStatusAndUserId );

//Profiles Location
router.post("/createLocation", locationController.createLocation);
router.post("/updateLocation", locationController.upadateLocation);
router.post("/deleteLocation", locationController.deleteLocation);
router.get("/getLocation", locationController.getLocation);
router.get("/getAllLocation", locationController.getAllLocation);
router.get("/getLocationByProProfileId", locationController.getLocationByProProfileId);
router.get("/getLocationByUserProfileId", locationController.getLocationByUserProfileId);
router.post("/updateSelectedLocation", locationController.updateSelectedLocation);

//Proposal
router.post("/createProposal",proposalController.createProposal);
router.post("/updateProposal", proposalController.updateProposal);
router.post("/deleteProposal", proposalController.deleteProposal);
router.post("/updateProposalStatus",proposalController.updateProposalStatus)
router.get("/getProposal", proposalController.getProposal);
router.get("/getProposalByStatusAndProProfileId", proposalController.getProposalByStatusAndProProfileId);
router.get("/getProposalByProjectIdOrStatus", proposalController.getProposalByProjectIdOrStatus);

//Admin
router.post( "/adminSignup", adminController.signUpAdmin);
router.post("/adminLogin", adminController.loginAdmin);

//Report
router.post("/reportedByPro", reportController.reportedByPro);
router.post("/reportedByUser", reportController.reportedByUser);

// Reviews
router.post("/createReview",reviewController.createReview);
router.post("/updateReview", reviewController.updateReview);
router.post("/deleteReview", reviewController.deleteReview);
router.get("/getReview", reviewController.getReview);
router.get("/getAllReview", reviewController.getAllReview);
router.get("/getAllReviewOnProProfile", reviewController.getAllReviewOnProProfile);
router.get("/averageRating", reviewController.getAverageRating);

//Support
router.post("/createSupport",supportController.createSupport);
router.get("/getSupport", supportController.getSupport);
router.get("/getAllSupport", supportController.getAllSupport);

//Notification
router.get("/getAllNotificationOfUser", notificationController.getAllNotificationOfUser);
router.get("/getAllNotificationOfProfessional", notificationController.getAllNotificationOfProfessional);
router.post("/deleteNotification", notificationController.deleteNotification);









module.exports = router;
