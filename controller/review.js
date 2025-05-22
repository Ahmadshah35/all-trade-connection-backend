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
      res.status(200).json({ status: "sucess", data: review, sucess: true });

      return;
    } else {
      return res.status(200).json({
        status: "failed",
        message: "data isn't saved in Database",
        sucess: false,
      });
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      sucess: false,
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
      return  res.status(200).json({ status: "sucess", data: review, sucess: true });

      
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "update failed", sucess: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
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
        .json({ message: "deleted sucessfully", data: review, sucess: true });
    } else {
      return res
        .status(200)
        .json({ status: "failed", message: "delete failed", sucess: false });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};

const getReview = async (req, res) => {
  try {
    const { id } = req.query;
    const review = await func.getReview({ _id: id });
    if (review.length == 0) {
      return res
        .status(200)
        .json({ status: "incorrect credentials", sucess: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: review, sucess: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};
const getAllReview = async (req, res) => {
  try {
    const { userId } = req.query;
    const review = await func.getAllReview({ userId: userId });
    if (review.length == 0) {
      return res
        .status(200)
        .json({ status: "incorrect credentials", sucess: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: review, sucess: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};


const getAllReviewOnProProfile = async (req, res) => {
  try {
    const { proProfileId } = req.query;
    const review = await func.getAllReviewOnProProfile({ proProfileId: proProfileId });
    if (!review) {
      return res
        .status(200)
        .json({ status: "reviews not found", sucess: false });
    } else {
      return res
        .status(200)
        .json({ status: "sucessful", data: review, sucess: true });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "something went wrong",
      sucess: false,
    });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { proProfileId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(proProfileId)) {
      return res
        .status(400)
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

    const rating =
      result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
      const review = await func.getAllReviewOnProProfile({ proProfileId: proProfileId });

    return res.status(200).json({ status: "successful", data: {rating,review} , sucess: true });
  } catch (error) {
    console.error("Error getting average rating:", error);
    
    return res
      .status(500)
      .json({
        status: "failed",
        sucess: false,
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
  getAllReview,
  getAverageRating,
  getAllReviewOnProProfile
};
