const { default: mongoose } = require("mongoose");
const func = require("../functions/review");
const reviewModel = require("../models/review");
const proProfileFunc = require("../functions/proProfile")


const createReview = async (req, res) => {
  try {
    const review = await func.createReview(req);
    const rating = await func.avgRating(review.proProfileId)
    const avgRating = rating.averageRating
    const updateProProfile = await proProfileFunc.updateAvgRating(review.proProfileId,avgRating)
    if (review) {
      res.status(200).json({ status: "sucess", data: review, success: true });

      return;
    } else {
      return res.status(200).json({
        status: "failed",
        message: "data isn't saved in Database",
        success: false,
      });
    }
  } catch (error) {
    console.error("failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.body;
    const userData = req.body;
    const review = await func.updateReview(id, userData);
    // console.log(profile)
    if (review) {
      return  res.status(200).json({ status: "sucess", data: review, success: true });

      
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "update failed", success: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.body;
    const review = await func.deleteReview(id);
    if (review) {
      return res
        .status(200)
        .json({ message: "deleted sucessfully", success: true });
    } else {
      return res
        .status(200)
        .json({ message: "delete failed", success: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const getReview = async (req, res) => {
  try {
    const { id } = req.query;
    const review = await func.getReview({ _id: id });
    if (!review) {
      return res
        .status(200)
        .json({ message: "reviews not found", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "sucessful", data: review, success: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};

const getReviewByUserIdOrProId = async (req, res) => {
  try {
    const { userId ,proId } = req.query;
    const review = await func.getReviewByUserIdOrProId(userId ,proId);
    if (!review || review.length == 0) {
      return res
        .status(200)
        .json({ message: "reviews not found", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "sucessful", data: review, success: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
    });
  }
};


 
const getAllReviewByProfileId = async (req, res) => {
  try {
    const { _id ,type } = req.user;
    if(type == "User"){
       const review = await func.getAllReview({ userId: _id });
    if (review.length == 0 || !review) {
      return res
        .status(200)
        .json({ message: "reviews not found", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "sucessful", data: review, success: true });
    }
    }
    if(type == "Professional"){
    const review = await func.getAllReviewOnProProfile( _id);
    if (!review || review.length == 0) {
      return res
        .status(200)
        .json({ message: "reviews not found", success: false });
      } else {
        const avdRating = await func.avgRating(_id)
        return res
          .status(200)
          .json({ message: "sucessful", data: {...review, avdRating}, success: true });
      }
    }
  } catch (error) {
    console.log("error", error)
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      success: false,
      error : error.message
    });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { proProfileId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(proProfileId)) {
      return res
        .status(200)
        .json({ status: "failed", message: "Invalid profile ID" });
    }

    const result = await reviewModel.aggregate([
      { $match: { proProfileId: new mongoose.Types.ObjectId(proProfileId) } },
      {
        $group: {
          _id: "$proProfileId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const rating = result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
      const review = await func.getAllReviewOnProProfile({ proProfileId: proProfileId });

    return res.status(200).json({ status: "successful", data: {rating,review} , success: true });
  } catch (error) {
    console.error("Error getting average rating:", error);
    
    return res
      .status(400)
      .json({
        status: "failed",
        success: false,
        message: "Server error",
        error: error.message,
      });
  }
};


module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getAverageRating,
  getAllReviewByProfileId,
  getReviewByUserIdOrProId
};
