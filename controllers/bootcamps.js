//next(err) are for CastError - errors which are find by id
//the
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../helpers/errorResponse');

const asyncHandler = require('../middleware/async');

const geocoder = require('../helpers/geocoder');

//@desc    get all bootcamps
//@route   GET /api/vi1/bootcamps
//@access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // console.log(req.query);
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `${$match}`
  );
  // console.log(queryStr);
  query = Bootcamp.find(JSON.parse(queryStr));
  const bootcamps = await query;

  res.status(200).json({
    success: true,
    data: bootcamps,
    count: bootcamps.length
  });
});

//@desc    get single bootcamps
//@route   GET /api/vi1/bootcamps/:id
//@access  public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

//@desc    create new bootcamp
//@route   POST /api/vi1/bootcamps
//@access  private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

//@desc    edit bootcamp
//@route   PUT /api/vi1/bootcamps/:id
//@access  private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200),
    json({
      success: true,
      data: bootcamp
    });
});

//@desc    delete bootcamp
//@route   DELETE /api/vi1/bootcamps/:id
//@access  private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200),
    json({
      success: true,
      data: {}
    });
});

//@desc    get bootcamps within radius
//@route   GET /api/vi1/bootcamps/radius/:zipcode/:distance
//@access  public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radiusInMiles = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radiusInMiles] }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
