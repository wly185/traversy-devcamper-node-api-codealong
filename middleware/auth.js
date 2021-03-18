const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../helpers/errorResponse');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const User = require('../models/User');

//!! figure out why postman authorisation = no auth, = bearer token does not work
//why jwt token keeps expiring

exports.protect = asyncHandler(async (req, res, next) => {
  // console.log('req.headers.cookie', req.headers.cookie);
  //console.log('req.cookies',req.cookies.token)
  // console.log(process.env.JWT_SECRET);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log('bearer', token);
  } else if (req.cookies.token) {
    token = req.cookies.token;
    // console.log('cookie token', token);
  }
  // console.log('token', token);

  if (!token) {
    return next(
      new ErrorResponse(`not authorised to access this route, no token`, 401)
    );
  }

  try {
    console.log('verifying');
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          console.log(err);
        } else {
          console.log(decoded);
        }
      }
    );

    req.user = await User.findById(decoded.id);
  } catch (err) {
    return next(
      new ErrorResponse(`not authorised to access this route,no user`, 401)
    );
  }
});

exports.authorize = (role) => {
  return (req, res, next) => {
    //not sure the typeof(role)
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `user role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
      //no res.redirect?
    }
    next();
  };
};
