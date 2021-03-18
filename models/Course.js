const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'pls add course title']
    },
    description: {
      type: String,
      required: [true, 'please add a description']
    },
    weeks: {
      type: String,
      required: [true, 'please add number of weeks']
    },
    tuition: {
      type: Number,
      required: [true, 'please add a tuition cost']
    },
    minimumSkill: {
      type: String,
      required: [true, 'please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bootcamp',
      required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  //39 - virtuals
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

//42
//calculate averages which are affected whenever you add (save) or remove (remove) a bootcamp
//mongo statics are called on the model/collection itself.
//aggregates
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // console.log(`calculating avg cost`);
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    { $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } } }
  ]);
  // console.log(obj);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

//why is there no next()
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.methods.getUser = async function (courseId) {
  const user = await Bootcamp.find({ course: courseId }).select('user');
  return user;
};

module.exports = mongoose.model('Course', CourseSchema);
