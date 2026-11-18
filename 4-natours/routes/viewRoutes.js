const express = require('express');
const viewsController = require('../controllers/viewsController');
const authcontroller = require('../controllers/authController');

const router = express.Router();

router.get('/', authcontroller.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authcontroller.isLoggedIn, viewsController.getTour);
router.get('/login', authcontroller.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authcontroller.protect, viewsController.getAccount);
router.post('/submit-user-data', authcontroller.protect, viewsController.updateUserData);

module.exports = router;
