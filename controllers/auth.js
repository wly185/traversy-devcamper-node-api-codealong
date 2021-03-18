const User = require('../models/User');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

const sendEmail = require('../helpers/sendEmail');
const crypto = require('crypto');

//49
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

//46

//@desc    register user
//@route   POST /api/vi1/auth/register
//@access  public
exports.register = asyncHandler(async (req, res, next) => {
  // console.log('register');
  // console.log(req.body);
  const { name, email, password, role } = req.body;

  //password hashing is at User model
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);

  res.status(200).json({ success: true, token });
});

//48

//@desc    register user
//@route   POST /api/vi1/auth/login
//@access  public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //check client

  if (!email || !password) {
    return next(new ErrorResponse(`please provide email and password`, 404));
  }

  //check db, need to +pw (usually excluded due to security)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse(`invalid credentials`, 401));
  }

  //match client pw against db hashed pw
  //method is from the model
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`invalid credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc    get current user
//@route   GET /api/vi1/auth/me
//@access  private
exports.getMe = asyncHandler(async (req, res, next) => {
  // console.log('getMe');
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

//66

//@desc    logout / clear cookie
//@route   GET /api/vi1/auth/logout
//@access  private
exports.logout = asyncHandler(async (req, res, next) => {
  //cookie parser
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, data: {} });
});

//@desc    forgot password
//@route   POST /api/vi1/auth/forgot password
//@access  private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // console.log('forgot password');
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`email ${req.body.email} does not exist`, 404)
    );
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `you are receiving this email beause you or someone else has requested the reset of a password. please make a PUT request to "\n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `password reset token`,
      message
    });
    res.status(200).json({
      success: true,
      data: 'please go email and click the reset link'
    });
  } catch (err) {
    console.log(err);

    user.resetPasswordExpire = undefined;
    user.resetToken = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`email could not be sent`, 500));
  }
});

//@desc    reset password
//@route   PUT /api/vi1/auth/resetpassword/:resettoken
//@access  public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  console.log('reset password');
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) {
    return next(new ErrorResponse(`invalid token`, 400));
  }

  user.password = req.body.password;

  user.getResetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);

  // res.status(200).json({ success: true });
});

//@desc    update users details
//@route   PUT /api/vi1/auth/update details
//@access  private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  console.log('update user details');
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

//@desc    update password
//@route   PUT /api/vi1/auth/update password
//@access  private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  console.log('update password');
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`password is incorrect`, 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//47
