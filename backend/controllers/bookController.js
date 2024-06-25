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
    cb(
      new AppError(404, {
        image: {
          name: 'INVALID_IMAGE',
          message: 'Not an image please only images',
        },
      }),
      false
    );
  }
};
const multerLimits = {
  fileSize: 1024 * 1024 * 10,
};
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: multerLimits,
});

exports.getAllBooks = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const features = new APIFeatures(BookModel.find(), req.query)
    .filter()
    .sorting()
    .limitFields()
    .paginate();
  const books = await features.queryObj;
  let tbooks = books;

  tbooks = await Promise.all(
    tbooks.map(async (book) => {
      if (book.image) {
        const image = await getBookImage(book.image);
        let tbook = { ...book._doc };
        tbook.image = image;
        return tbook;
      } else return book;
    })
  );
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tbooks.length,
    data: {
      books: tbooks,
      schema: JSON.parse(JSON.stringify(BookModel.schema.obj)),
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return next(
      new AppError(404, {
        misc: {
          name: 'BOOK_NOT_FOUND',
          message: 'No book found with that ID',
        },
      })
    );
  }
  let bookDetails = book;
  if (book.image) {
    const image = await getBookImage(book.image);
    bookDetails = { ...book._doc };
    bookDetails.image = image;
  }
  const imageBuf = await getBookImage(book.image);
  res.status(200).json({
    status: 'success',
    data: {
      book: bookDetails,
    },
  });
});

exports.getMyBooks = catchAsync(async (req, res, next) => {
  console.log(req.user);
  console.log('from get my book');
  const books = await BookModel.find({ owner: req.user._id });
  let tbooks = books;
  tbooks = await Promise.all(
    tbooks.map(async (book) => {
      if (book.image) {
        const image = await getBookImage(book.image);
        let tbook = { ...book._doc };
        tbook.image = image;
        return tbook;
      } else return book;
    })
  );
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tbooks.length,
    data: {
      books: tbooks,
    },
  });
});

exports.addBook = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.id;
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
    return next(
      new AppError(404, {
        misc: {
          name: 'BOOK_NOT_FOUND',
          message: 'No book found with that ID for this user',
        },
      })
    );
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
  const BufferImage = await stream2buffer(
    gridfsbucket.openDownloadStream(fileId)
  );
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
