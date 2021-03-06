const Users = require('../models/usermodel');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/usermodel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFiellds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFiellds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await Users.find();

  res.status(201).json({
    status: 'success',
    data: {
      users,
    },
  });
});
exports.getDetails = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        _id: req.user._id,
      },
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1)Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You can not Update your password Using this route. use /updatePassword',
        400,
        {
          misc: {
            name: 'INVALID_REQUEST',
            message:
              'You can not Update your password Using this route. use /updatePassword',
          },
        }
      )
    );
  }
  // 2) Filtered out unallowed fields to update
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});
