const express = require('express');
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const advancedResults = require('../middleware/advancedResults');
//for advanced results middleware
const Bootcamp = require('../models/Bootcamp');
const { protect, authorize } = require('../middleware/auth');
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

//other routes
router.use('/:id/courses', courseRouter);
router.use('/:id/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  //44
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher,admin'), createBootcamp);
//not sure about the typeof(args)
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher,admin'), updateBootcamp)
  .delete(protect, authorize('publisher,admin'), deleteBootcamp);

router
  .route('/:id/photos')
  .put(protect, authorize('publisher,admin'), bootcampPhotoUpload);

module.exports = router;
