const mongoose = require('mongoose');
//48
const bcrypt = require('bcryptjs');
//47
const jwt = require('jsonwebtoken');
//56
const crypto = require('crypto');

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
  //56
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//47
// sign and return token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

//48
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//56
UserSchema.methods.getResetPasswordToken = function () {
  console.log('get reset token');
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken, resetPasswordExpire;
};

module.exports = mongoose.model('User', UserSchema);
