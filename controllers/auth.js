const User = require('../models/User');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

//46

//@desc    register user
//@route   POST /api/vi1/auth/register
//@access  public
exports.register = asyncHandler(async (req, res, next) => {
  // res.status(200).json({ success: true });
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  // const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
