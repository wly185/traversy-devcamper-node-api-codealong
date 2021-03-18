const User = require('../models/User');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

const sendEmail = require('../helpers/sendEmail');
const crypto = require('crypto');

//@desc    get all users
//@route   GET /api/vi1/auth/users
//@access  private / admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  console.log('get all users');

  res.status(200).json(res.advancedResults);
});

//@desc    get single user
//@route   GET /api/vi1/auth/users/:id
//@access  private / admin
exports.getUser = asyncHandler(async (req, res, next) => {
  console.log('get a user');
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

//@desc    create a user
//@route   POST /api/vi1/auth/users
//@access  private / admin
exports.addUser = asyncHandler(async (req, res, next) => {
  console.log('create user');

  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

//@desc    update user
//@route   PUT /api/vi1/auth/users/:id
//@access  private / admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  console.log('update user');

  let user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // if (!user) {
  //   return next(
  //     new ErrorResponse(`user with id ${req.params.id} not found`, 404)
  //   );
  // }

  res.status(200).json({ success: true, data: user });
});

//@desc    delete user
//@route   DELETE /api/vi1/auth/users/:id
//@access  private / admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  console.log('delete user');
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});
