//25//26//27//28//29

//files
// server.js - (mount error middleware)
// helpers/errorResponse.js - (extends core error class)
// middleware/error.js - (import errorResponse)
// middleware/async.js
// controllers/all controllers - (import |errorResponse, async for error handling| (-) try catch, (+) next new errorresponse)

//core error class from node js
//not middleware
//customise | error msg + status code
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
