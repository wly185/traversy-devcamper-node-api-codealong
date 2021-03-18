//25//26//27//28//29

//files |server js |async js  | error js|errorresponse js|
// server.js - (mount error response)
// helpers/errorResponse.js - (mount error middleware)
// middleware/error.js - (import errorResponse)
// middleware/async.js
// controllers/all controllers - (import errorResponse, async)

//types of errors
//cast errors | duplicate errors | validation errors

//see mongoose help page on mongo error handler
//direct mongo errors to be handled in error handler instead of at the controller

//other errors are generally called server error 500

const ErrorResponse = require('../helpers/errorResponse');

const errorHandler = (err, req, res, next) => {
  //copy from Error Object
  let error = { ...err };
  error.message = err.message;

  //stack printout for dev
  console.log(err.stack);
  // *console.log(err.value);
  // *console.log(err.message);
  // *console.log(err.name);

  //mongoose error
  //casterror | bad format id, resource not found???
  //*had to use 'msg' instead of 'message'
  if (err.name === 'CastError') {
    const msg = `Resource not found`;
    error = new ErrorResponse(msg, 404);
  }

  //11000 a kind of MongoError | duplicate
  if (err.code === 11000) {
    const msg = `duplicate field value entered`;
    error = new ErrorResponse(msg, 400);

    // *console.log(error);
  }

  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(msg, 400);
  }

  //use 'error' instead of 'err'
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'server error' });
};

module.exports = errorHandler;
