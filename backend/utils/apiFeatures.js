class APIFeatures {
  //queryObj is MongoDB Query.prototype()
  //reqQuery is req.query from Incoming request
  constructor(queryObj, reqQuery) {
    this.queryObj = queryObj;
    this.reqQuery = reqQuery;
  }

  filter() {
    // 1a) Filtering
    const tempReqQuery = JSON.parse(JSON.stringify(this.reqQuery));
    //making a deepcopy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete tempReqQuery[el]);
    // 1b) Advance Filtering
    let filterStr = JSON.stringify(tempReqQuery);
    filterStr = filterStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.queryObj.find(JSON.parse(filterStr));
    return this;
  }

  sorting() {
    // 2) Sorting
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.queryObj.sort(sortBy);
    } else {
      this.queryObj.sort('-createdAt');
    }
    return this;
  }

  // 3) Field limiting
  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.queryObj.select(fields);
    } else {
      this.queryObj.select('-__v');
    }
    return this;
  }

  // 4) Pagination
  paginate() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.queryObj.skip(skip).limit(limit);
    return this;
  }

  // 5) Search by tags
  Searchbytags() {
    this.queryObj.all('tags');
  }
}

module.exports = APIFeatures;
