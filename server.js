const express = require('express');
// const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const cookieParser = require('cookie-parser');

const connectDB = require('./db');
const morgan = require('morgan');

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

connectDB();
const app = express();

//app.use middleware
app.use(express.json());
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//43
app.use(fileupload());

//security
//!! xss prevent html from being added
//!! DNS prefetching
//!! nosql attack

//security
//67
app.use(mongoSanitize());
//68
app.use(helmet());
app.use(xss());
app.use(cors());

//load
//69
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(hpp());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//app.use routing
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

//somehow you have to put below the routes
//25
// app.use(cookieParser);
app.use(errorHandler);

//listen
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);

//handle error, process.exit(1)
process.on('unhandledRejection', (err, promise) => {
  console.log(`error:${err.message}`);
  server.close(() => process.exit(1));
});
