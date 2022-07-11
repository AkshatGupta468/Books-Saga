const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');

const BookModel = require('../models/bookmodel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { findOneAndUpdate } = require('../models/bookmodel');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now());
//   },
// });

const storage = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return {
      filename: req.user._id + '-' + Date.now(),
      bucketName: 'uploads',
    };
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image please only images', 404), false);
  }
};
const multerLimits = {
  fileSize: 512000,
};
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: multerLimits,
});

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
  const imageBuf = await getBookImage(book.image);
  console.log('here2');
  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
    imageBuf,
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
  if (req.file) req.body.image = req.file.id;
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

  res.status(203).json({
    status: 'success',
  });
});

exports.uploadBookImage = upload.single('photo');

const getBookImage = catchAsync(async (fileId) => {
  const gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: 'uploads',
  });
  const BufferImage = await stream2buffer(gridfsbucket.openDownloadStream(fileId));
  return BufferImage.toString('base64');
});

function stream2buffer(stream) {
  return new Promise((resolve, reject) => {
    let buf = new Buffer.from([]);
    stream.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
    });
    stream.on('end', () => resolve(Buffer.concat([buf])));
    stream.on('error', (err) => reject(err));
  });
}
