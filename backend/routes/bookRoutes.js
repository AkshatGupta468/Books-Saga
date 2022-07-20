const express = require('express');

const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');

const bookRouter = express.Router();

bookRouter.use(authController.protect);

bookRouter.route('/getMyBooks').get(bookController.getMyBooks);
bookRouter
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.uploadBookImage, bookController.editBook)
  .delete(bookController.deleteBook);
bookRouter
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.uploadBookImage, bookController.addBook);
module.exports = bookRouter;
