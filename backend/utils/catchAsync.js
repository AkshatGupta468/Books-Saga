const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
//equivalent of wrinting catch(err => next(err))
module.exports = catchAsync;
