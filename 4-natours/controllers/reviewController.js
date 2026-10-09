const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

module.exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;

  const queryObj = { ...req.query, ...(req.aliasQuery || {}) };
  const query = Review.find(filter);

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

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
};

module.exports.createReview = factory.createOne(Review);

// module.exports.createReview = catchAsync(async (req, res, next) => {
//   // allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   // if (!req.body.user) req.body.user = req.user.id;
//   req.body.user = req.user.id;

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
