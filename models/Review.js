const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'pls add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'please add a description']
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'please add a rating between 1 to 10']
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
});

//prevent user from submitting more than 1 review per bootcamp
ReviewSchema.index({bootcamp:1,user:1},{unique:true});


//64

//static method to get the avg rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  // *console.log(`calculating avg cost`);
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    { $group: { 
      _id: '$bootcamp', 
      averageRating: { $avg: '$rating'}
     } }
  ]);
  // console.log(obj);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
