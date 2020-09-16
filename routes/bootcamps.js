const express = require('express');
const courseRouter = require('./courses');
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');
const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  bootcampPhotoUpload,
  getBootcampsInRadius
} = require('../controllers/bootcamps');

const router = express.Router();

router.use('/:id/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  //44
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/:id/photos').put(bootcampPhotoUpload);

module.exports = router;
