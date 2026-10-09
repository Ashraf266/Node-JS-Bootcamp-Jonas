const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// to have access to other routes params when nested
const router = express.Router({ mergeParams: true });

// POST /tours/893247/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourAndUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(authController.protect, reviewController.deleteReview)
  .patch(authController.protect, reviewController.updateReview);

module.exports = router;
