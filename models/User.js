const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//45
const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'please add name'] },
  email: {
    type: String,
    required: [true, 'please add email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: { type: String, enum: ['user', 'publisher'], default: 'user' },
  //to make a user an admin, have to do manually in db
  password: {
    type: String,
    required: [true, 'please add password'],
    minlength: 6,
    select: false
    //select false to not flow password
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

//46
UserSchema.pre('save', async function (next) {
  const salt = await bycrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//47
UserSchema.methods.getSignedJwtToken = function () {
  // console.log(process.env.JWT_SECRET);
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', UserSchema);
