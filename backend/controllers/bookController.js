const BookModel = require('../models/bookmodel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { findOneAndUpdate } = require('../models/bookmodel');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(BookModel.find(), req.query)
    .filter()
    .sorting()
    .limitFields()
    .paginate();
  const books = await features.queryObj;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.addBook = catchAsync(async (req, res, next) => {
  req.body.owner = req.user._id;
  const book = await BookModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.editBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findOneAndUpdate(
    {
      owner: req.user._id,
      _id: req.params.id,
    },
    req.body,
    { new: true, runValidators: true }
  );
  // const book = await BookModel.findOneAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  if (!book) {
    return next(new AppError('No book found with that ID for this user', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findOneAndDelete({
    owner: req.user._id,
    _id: req.params.id,
  });

  if (!book) {
    return next(new AppError('No book found with that ID for this user', 404));
  }
  console.log('deleted book', book);
  res.status(203).json({
    status: 'success',
  });
});
