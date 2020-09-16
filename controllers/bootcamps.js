//next(err) are for CastError - errors which are find by id
//the
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../helpers/geocoder');
const path = require('path');

//@desc    get all bootcamps
//@route   GET /api/vi1/bootcamps
//@access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    //44
    .json(res.advancedResults);
});

//@desc    get single bootcamps
//@route   GET /api/vi1/bootcamps/:id
//@access  public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  console.log(bootcamp);
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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`resource not found with id of ${req.params.id}`, 404)
    );
  }

  //39 - cascade delete - trigger middleware on 'remove'
  bootcamp.remove();

  res.status(200).json({
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

//@desc    upload photo for bootcamp
//@route   PUT /api/vi1/bootcamps/:id/photo
//@access  private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`bootcamp with id ${req.params.id} not found`, 404)
    );
  }
  //43 - upload files
  if (!req.files) {
    return next(new ErrorResponse(`please upload a file]`, 400));
  }

  // console.log(req.files);

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`please upload an image file`));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    // console.log(process.env.MAX_FILE_UPLOAD);

    return next(
      new ErrorResponse(
        `please upload image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  // console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
    }
    return next(new ErrorResponse(`problem with file upload`, 500));
  });

  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    success: true,
    data: file.name
  });
});
