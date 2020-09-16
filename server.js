const express = require('express');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const connectDB = require('./db');

const morgan = require('morgan');

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');

connectDB();

const app = express();

app.use(express.json());

// app.use(logger);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//43
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
// app.use('./api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`error:${err.message}`);
  server.close(() => process.exit(1));
});
