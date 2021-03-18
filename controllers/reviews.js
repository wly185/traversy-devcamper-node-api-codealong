//error handlers
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');

//models
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get all reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // console.log('getCourses', req.params.id);

  if (req.params.bootcampId) {
    const reviews = Review.find({ bootcamp: req.params.bootcampId });

    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//what is async handler for
//does it conttain  async req res next
//error middleware not working

//@desc  see single review
//@route GET/api/v1/bootcamps/:id/reviews
// GET/api/v1/reviews/:id
//@access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`no review found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

//@desc  add review
//@route POST/api/v1/bootcamps/:bootcampId/reviews
//@access Private
//@authroisation user
exports.addReview = asyncHandler(async (req, res, next) => {
  //tack on bootcamp and user to req
  req.body.bootcamp = req.params.id;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.id);

  // console.log(req.params.id,bootcamp);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `no bootcamp with id of ${req.params.bootcampId} found`
      ),
      404
    );
  }
  // console.log(req.body);
  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

//@desc  update review
//@route PUT/api/v1/reviews/:id
//@access Private
//@authroisation user admin
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`no review with id of ${req.params.id} found`),
      404
    );
  }

  //permissions
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('not authorised to update review'));
  }

  console.log(req.body);
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: review });
});

//@desc  delete review
//@route DELETE/api/v1/reviews/:id
//@access Private
//@authroisation user admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`no review with id of ${req.params.id} found`),
      404
    );
  }

  console.log(req.user.role);
  console.log(req.user.id);
  console.log(review.user.toString());

  //permissions
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('not authorised to delete review'));
  }

  //dont need findbyidanddelete
  //review document, no need pass options
  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
