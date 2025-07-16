const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/review")


const createReview = async (req) => {
  const review = new reviewModel(req.body);
  const result = await review.save();
  return result;
};

const updateReview = async (id, userData) => {
  const review = await reviewModel.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  );
  return review;
};

const deleteReview = async (id) => {
  const review = await reviewModel.findByIdAndDelete({_id:id}, {
    new: true,
  });
  return review;
};

const getReview = async (id) => {
  const review = await reviewModel.findById(id);
  return review;
}; 

const getReviewByUserIdOrProId = async (userId,proId) => {
  const review = await reviewModel.find({userId:userId ,proProfileId:proId}).sort({createdAt: -1});
  return review;
}; 

const getAllReview = async (userId) => {
  const review = await reviewModel.find(userId);
  return review;
};


const getAllReviewOnProProfile = async (proProfileId) => {
  const review = await reviewModel.find({proProfileId:proProfileId}).populate({
    path:"userId",
    select:"-password"
  });
  return review;
};


const avgRating = async (proProfileId) => {
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
  return rating;
};

module.exports = {
createReview,
updateReview,
deleteReview,
getReview,
getAllReview,
getAllReviewOnProProfile,
avgRating,
getReviewByUserIdOrProId
};
