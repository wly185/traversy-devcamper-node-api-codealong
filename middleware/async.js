//25//26//27//28//29

//files [server.js, /controllers, helpers/errorresponse, middleware/async, middleware/error]

// https://www.acuriousanimal.com/blog/2018/03/15/express-async-middleware
//https://eloquentjavascript.net/11_async.html #Promises


// async/await errors must always be handled. usually with try/catch
//avoid try/catch code on each async middleware, use a higher order function


const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

//promise 
//.resolve() [success, fn(req, res,next)] *Promise.resolve() creates a promise
// .catch() [fail, (next(err))]


