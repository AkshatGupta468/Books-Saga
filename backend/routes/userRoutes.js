const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgorPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protect);
userRouter.patch('/updatePassword', authController.updatePassword);

userRouter
  .route('/Details')
  .get(userController.getDetails)
  .patch(userController.updateMe);

userRouter
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers);

module.exports = userRouter;
