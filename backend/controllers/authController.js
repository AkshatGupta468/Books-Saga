const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/usermodel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and passwords exists
  if (!email) {
    return next(
      new AppError(400, {
        email: {
          name: 'REQ_EMAIL',
          message: 'Email is Required',
        },
      })
    );
  }
  if (!password) {
    return next(
      new AppError(400, {
        password: {
          name: 'REQ_PASSWORD',
          message: 'Password is Required',
        },
      })
    );
  }
  // 2) Check if the user exists and password is correct
  const user = await User.findOne({
    email: email,
  }).select('+password');
  //select for password is disables which has to be enabled here
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(401, {
        email: {
          name: 'INVALID_EMAIL_PASSWORD',
          message: 'Incorrect email or password',
        },
        password: {
          name: 'INVALID_EMAIL_PASSWORD',
          message: 'Incorrect email or password',
        },
      })
    );
  }
  // 3) if everything ok, send the token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError(401, {
        misc: {
          name: 'NOT_LOGGED_IN',
          message: 'Your are not logged in!',
        },
      })
    );
  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError(401, {
        misc: {
          name: 'USER_DELETED',
          message: 'The user belonging to the token no longer exists',
        },
      })
    );

  // 4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(401, {
        misc: {
          name: 'USER_PASSWORD_CHANGED',
          message: 'User recently changed password! Please log in again.',
        },
      })
    );
  // 5) Check if the Book owner is the user
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(403, {
          misc: {
            name: 'UNAUTHORIZED',
            message: 'You do not have permission to perform this action',
          },
        })
      );
    next();
  };

exports.forgorPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new AppError(404, {
        email: {
          name: 'INVALID_EMAIL',
          message: 'There is no user with that email address',
        },
      })
    );
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save();
  // { validateBeforeSave: false }

  // 3)Sent it to user's email
  const resetURL = `${req.body.resetURL}/${resetToken}`;
  const message = `Forgot your password? Go to given URL :  ${resetURL}\nThis URL is only valid for 10 minutes. If you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message: message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new AppError(500, {
        email: {
          name: 'MAIL_NOT_SENT',
          message: 'There was a error sending mail',
        },
      })
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is user, set the new password
  if (!user)
    return next(
      new AppError(400, {
        misc: {
          name: 'INVALID_TOKEN',
          message: 'Token is invalid or has expired',
        },
      })
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changePasswrodAt property for the user
  //happens automatically
  // 4) Log the user in,send JWT
  createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // 2) Check if the POSTed password is correct
  if (!(await user.correctPassword(req.body.oldPassword, user.password)))
    return next(
      new AppError(403, {
        password: {
          name: 'INVALID_PASSWORD',
          message: 'The Old password entered is incorrect',
        },
      })
    );
  // 3) if so, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();
  //we cannot user findByIdAndUpdate because validator will not run in this case
  //and encrypytion is defined for presave middlewares only
  //we should only use .save() while dealing with passwords
  // 4)Log user in,send JWT
  createSendToken(user, 201, res);
});
