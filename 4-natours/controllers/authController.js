const { promisify } = require('util');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token = req.get('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    throw new AppError(
      'You are not logged in! Please log in to get access.',
      401,
    );
  }

  token = token.split(' ')[1];

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exist
  const user = await User.findById(decoded.id);
  if (!user)
    throw new AppError(
      'The user belonging to this token does no longer exist.',
      401,
    );

  // check if user change password after token is issued
  if (user.passwordChangedAfter(decoded.iat)) {
    throw new AppError(
      'User recently changed password! Please log in again.',
      401,
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
