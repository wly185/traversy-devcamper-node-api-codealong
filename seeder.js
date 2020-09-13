const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bootcamp = require('./models/Bootcamp');
dotenv.config({ path: './config/config.env' });

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGOURL, {
    dbName: 'node-api-masterclass',
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(console.log(`db connected`))
  .catch((err) => console.log(err));
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('data imported...');
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('data destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  console.log(bootcamps);
  Bootcamp.create(bootcamps).then(console.log('seeder importing data...'));
  // importData();
  // console.log(bootcamps);
} else if (process.argv[2] === '-d') {
  deleteData();
}
