//44
const advancedResults = (model, populate) => async (req, res, next) => {
  // console.log(req.query);
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((param) => delete reqQuery[param]);

  // console.log(reqQuery);
  let queryStr = JSON.stringify(reqQuery);

  //ep 34 - filter by math operators in mongo
  // create mongo operators like $gte etc
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // console.log(queryStr);

  //args - model - [called in [routes]]
  query = model.find(JSON.parse(queryStr));

  //ep 34 - select fields to display

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
    // console.log(fields);
  }

  //ep 35 - sorting

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //ep 36 - pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //args - populate [called in [routes]]
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    data: results,
    count: results.length,
    pagination
  };
  next();
};

module.exports = advancedResults;
