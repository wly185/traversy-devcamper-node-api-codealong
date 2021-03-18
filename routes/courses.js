const express = require('express');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(advancedResults(Course, 'bootcamps'), getCourses)
  .post(protect, addCourse);

//dont understand the post route
router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
