const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDB = require('./db');
dotenv.config({ path: './config/config.env' });
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(express.json());

// app.use(logger);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps);
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
