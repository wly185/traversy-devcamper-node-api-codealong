const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGOURL, {
      dbName: 'node-api-masterclass',
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(console.log(`db connected`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
