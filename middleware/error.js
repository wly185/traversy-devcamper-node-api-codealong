// errors are for cast errors - cannot find resource by id - considered bad request 404 error
// 400 errors are handled at the model
//other errors are generally called server error 500

//types of errors
//cast errors duplicate errors validation errors
const ErrorResponse = require('../helpers/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err.stack);

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //in case you dont use mongo, MongoError
  if (err.code === 11000) {
    const message = `duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: err.message || 'server error' });
};

module.exports = errorHandler;
