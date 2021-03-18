//LOAD CONTROLLER,MODEL, MIDDLEWARE, OTHER ROUTE
//MOUNT MIDDLEWARE, DECLARE ROUTES

//load controllers
const express = require('express');
const {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

//load model, include other routes
const User = require('../models/User');
const router = express.Router({ mergeParams: true });

//load middleware
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//use middleware on all routes
router.use(protect);
router.use(authorize('admin'));

//routing
router.route('/').get(advancedResults(User), getUsers).post(addUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
