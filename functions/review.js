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

const getAllReview = async (userId) => {
  const review = await reviewModel.find(userId);
  return review;
};


const getAllReviewOnProProfile = async (proProfileId) => {
  const review = await reviewModel.find(proProfileId);
  return review;
};

module.exports = {
createReview,
updateReview,
deleteReview,
getReview,
getAllReview,
getAllReviewOnProProfile
};
