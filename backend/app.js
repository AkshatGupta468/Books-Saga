const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const booksRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

app.use('/api/v1/books', booksRouter);
app.use('/api/v1/users/', userRouter);
app.use('/healthz', (req, res, next) => {
  res.status(200).send('Hello, I am Backend Server of Book-Saga');
});
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
