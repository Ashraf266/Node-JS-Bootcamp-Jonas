const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password must have at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // 'this' only works on CREATE and SAVE!!! Not on UPDATE
      // this in update operations will point to the current query, not the document
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// Instance method to check if the password is correct
userSchema.methods.correctPassword = async function (
  cadidatePassword,
  userPassword,
) {
  //can't use this.password because we select: false on password on schema
  return await bcrypt.compare(cadidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.pre('save', async function () {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return;

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordChangedAt = Date.now() - 1000;

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
