const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

module.exports.getAllReviews = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query, ...(req.aliasQuery || {}) };
  const query = Review.find();

  features = new APIFeatures(query, queryObj);
  features.filter().sort().limitFields().paginate();

  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
