const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // console.log('getCourses', req.params.id);

  if (req.params.id) {
    const courses = Course.find({ bootcamp: req.params.id });

    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }

  res.status(200).json({ data: courses, success: true, count: courses.length });
});

// @desc      Get a course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  // console.log('getCourse');
  // const course = await Course.findById(req.params.id).populate({
  //   path: 'bootcamp',
  //   select: 'name'
  // });

  res.status(200).json({ data: [course, user], success: true });
});

// @desc      create a course
// @route     POST /api/v1/bootcamps/:id/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // console.log('addCourse', req.params.id);

  //course.bootcamp, course.user
  req.body.bootcamp = req.params.id;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`no bootcamp with id ${req.params.id}`, 404));
  }

  //check bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorised to add course to bootcamp id ${bootcamp._id}`
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ data: course, success: true });
});

// @desc      update a course
// @route     PUT /api/v1/bootcamps/:id/courses
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  // console.log('updateCourse', req.params.id);
  //which req.params.id

  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`no course with id of ${req.params.id}`, 404)
    );
  }

  // console.log(course.user);
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorised to update course ${course._id}`,
        403
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: course });
});

// @desc      delete a course
// @route     DELETE /api/v1/bootcamps/:id/courses
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  // console.log('deleteCourse', req.params.id);

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ErrorResponse(`no course with id ${req.params.id}`, 404));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorised to delete course ${course._id}`,
        403
      )
    );
  }

  await course.remove();

  res.status(200).json({ data: {}, success: true });
});
